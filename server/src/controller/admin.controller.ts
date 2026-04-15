import { Request, Response } from "express"
import { prisma } from "../config/prisma.js"
import User from "../models/user.schema.js"
import Company from "../models/company.schema.js"
import { LeadRequest } from "../models/leadRequest.schema.js"
import { CredentialHistory } from "../models/credentialHistory.schema.js"
import { escapeRegex } from "../utils/companyLeads.js"
import { sendLeadCredentialsEmail } from "../utils/mail.js"
import Session from "../models/session.schema.js"
import bcrypt from "bcrypt"
import crypto from "crypto"

// list pending jobs
export async function getAdminPendingJobs(req: Request, res: Response) {
    try {
        const user = (req as any).user
        if (user.role !== "ADMIN") return res.status(403).json({ message: "Forbidden" })

        const pendingJobs = await prisma.postJob.findMany({
            where: { status: "pending" },
            orderBy: { createdAt: "desc" },
        })

        const userIds = [...new Set(pendingJobs.map((job) => job.userId).filter(Boolean))]
        const users = await User.find({ _id: { $in: userIds } })
        const userMap = new Map(users.map((u) => [String(u._id), u]))

        return res.status(200).json({
            message: "Pending jobs for admin fetched Successfully",
            jobs: pendingJobs.map((job) => ({ ...job, user: userMap.get(job.userId ?? "") || null })),
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

// list approved and rejected jobs
export async function getAdminApprovedJobs(req: Request, res: Response) {
    try {
        const user = (req as any).user
        if (user.role !== "ADMIN") return res.status(403).json({ warning: "!!Forbidden" })

        const approvedJobs = await prisma.postJob.findMany({
            where: { status: { in: ["approved", "rejected"] } },
            orderBy: { createdAt: "desc" },
        })

        const userIds = [...new Set(approvedJobs.map((job) => job.userId).filter(Boolean))]
        const users = await User.find({ _id: { $in: userIds } })
        const userMap = new Map(users.map((u) => [String(u._id), u]))

        return res.status(200).json({
            message: "Approved Jobs for admin fetched Successfully",
            jobs: approvedJobs.map((job) => ({ ...job, user: userMap.get(job.userId ?? "") || null })),
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

// admin approving and rejecting jobs
export async function adminReviewJob(req: Request, res: Response) {
    try {
        const user = (req as any).user
        const { jobId } = req.params as { jobId: string }
        const { action, reason } = req.body

        if (user.role !== "ADMIN") return res.status(403).json({ message: "Forbidden" })
        if (!["approved", "rejected"].includes(action))
            return res.status(400).json({ message: "Invalid Action. Must be approved or rejected" })
        if (action === "rejected" && !reason?.trim())
            return res.status(400).json({ message: "Reason is required when rejecting a job" })

        const job = await prisma.postJob.findUnique({ where: { id: jobId } })
        if (!job) return res.status(404).json({ message: "Job not found" })
        if (job.status !== "pending") return res.status(400).json({ message: "Job has already been reviewed" })

        const updatedJob = await prisma.postJob.update({ where: { id: jobId }, data: { status: action } })
        await prisma.jobApproval.create({
            data: { jobId, leadId: String(user._id), leadName: user.name, action, reason: reason ?? null },
        })

        return res.status(200).json({ message: `Job ${action} successfully`, job: updatedJob })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export async function getAdminSingleJob(req: Request, res: Response) {
    try {
        const user = (req as any).user
        const { jobId } = req.params

        if (user.role !== "ADMIN") return res.status(401).json({ message: "Unauthorized" })
        if (!jobId) return res.status(404).json({ message: "Job not found" })

        const fetchJob = await prisma.postJob.findUnique({ where: { id: jobId as string } })
        const jobUser = fetchJob?.userId
            ? await User.findById(fetchJob.userId).select("_id name email isEmailVerified company role")
            : null

        return res.status(200).json({
            message: "Single Job based on Id Fetched for Admin",
            job: { ...fetchJob, user: jobUser ?? null },
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

// Get user requests for lead in admin
export async function getUserRequestForLeadToAdmin(req: Request, res: Response) {
    try {
        const user = (req as any).user
        if (user.role !== "ADMIN") return res.status(401).json({ message: "Unauthorized. Admin Only" })

        const pendingRequests = await LeadRequest.find({ status: "pending" }).populate("userId", "name email")
        return res.status(200).json({ message: "Pending Requests from the user fetched", requests: pendingRequests })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

// approve and reject requests from user to become a lead
export async function adminApprovetoUser(req: Request, res: Response) {
    try {
        const admin = (req as any).user
        const { requestId } = req.params
        const { action, adminComment } = req.body

        if (admin.role !== "ADMIN") return res.status(401).json({ message: "Unauthorized" })
        if (!["approve", "reject"].includes(action))
            return res.status(400).json({ message: "Invalid action. Must be 'approve' or 'reject'." })

        const leadRequest = await LeadRequest.findById(requestId)
        if (!leadRequest) return res.status(404).json({ message: "Lead request not found." })
        if (leadRequest.status !== "pending")
            return res.status(400).json({ message: "This request has already been processed." })

        if (action === "approve") {
            const existingUser = await User.findById(leadRequest.userId)
            if (!existingUser) return res.status(404).json({ message: "User not found." })

            // 1. Generate new credentials
            const newEmail = leadRequest.companyEmail.toLowerCase().trim()
            const plainPassword = crypto.randomBytes(10).toString("base64url").slice(0, 14)
            const hashedPassword = await bcrypt.hash(plainPassword, 12)

            // 2. Archive old credentials
            await CredentialHistory.create({
                userId: existingUser._id,
                previousEmail: existingUser.email,
                previousPasswordHash: existingUser.password,
                newEmail,
                reason: "lead_promotion",
                companyName: leadRequest.companyName,
                position: leadRequest.position,
                promotedAt: new Date(),
                promotedBy: admin._id,
            })

            // 3. Upsert company
            const companyName = leadRequest.companyName.trim()
            const uid = leadRequest.userId
            let company = await Company.findOne({ name: new RegExp("^" + escapeRegex(companyName) + "$", "i") })

            if (!company) {
                company = await Company.create({
                    name: companyName,
                    primaryLeadId: uid,
                    userIds: [uid],
                    members: [{ userId: uid, role: "primary_lead" }],
                })
            } else {
                const alreadyMember = company.members?.some((m) => String(m.userId) === String(uid))
                if (!alreadyMember) {
                    if (!company.members) company.members = []
                    company.members.push({ userId: uid, role: company.primaryLeadId ? "lead" : "primary_lead" })
                }
                if (!company.userIds?.some((id) => String(id) === String(uid))) company.userIds.push(uid)
                if (!company.primaryLeadId) company.primaryLeadId = uid
                await company.save()
            }

            // 4. Stage the promotion — don't apply yet, user must confirm manually
            await User.findByIdAndUpdate(leadRequest.userId, {
                pendingLeadPromotion: {
                    newEmail,
                    newPasswordHash: hashedPassword,
                    companyId: company._id,
                    companyName: company.name,
                    position: leadRequest.position,
                    approvedAt: new Date(),
                },
            })

            leadRequest.status = "approved"
            leadRequest.adminComment = adminComment || ""
            leadRequest.processedAt = new Date()
            leadRequest.processedBy = admin._id
            await leadRequest.save()

            // 5. Send credentials email (fire-and-forget)
            sendLeadCredentialsEmail(newEmail, existingUser.name, plainPassword, companyName, leadRequest.position).catch(() => {})

            return res.status(200).json({
                message: "Lead request approved. Credentials staged — user must activate manually.",
                leadRequest,
            })
        }

        // Reject path
        leadRequest.status = "rejected"
        leadRequest.adminComment = adminComment || ""
        leadRequest.processedAt = new Date()
        leadRequest.processedBy = admin._id
        await leadRequest.save()

        return res.status(200).json({ message: "Lead request rejected successfully", leadRequest })
    } catch (error) {
        console.error("adminApprovetoUser error:", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

// User activates their own lead promotion (deletes old creds, applies new ones)
export async function activateLeadPromotion(req: Request, res: Response) {
    try {
        const user = (req as any).user

        const freshUser = await User.findById(user._id)
        if (!freshUser) return res.status(404).json({ message: "User not found." })

        const pending = freshUser.pendingLeadPromotion
        if (!pending?.newEmail) {
            return res.status(400).json({ message: "No pending lead promotion found." })
        }

        // Apply the staged promotion
        await User.findByIdAndUpdate(user._id, {
            role: "LEAD",
            email: pending.newEmail,
            password: pending.newPasswordHash,
            isEmailVerified: true,
            mustChangePassword: true,
            company: {
                companyId: pending.companyId,
                companyName: pending.companyName,
                position: pending.position,
            },
            $unset: { pendingLeadPromotion: 1 },
        })

        // Invalidate all sessions — user must log in with new credentials
        await Session.deleteMany({ userId: String(user._id) })

        return res.status(200).json({
            message: "Lead account activated. Please log in with your new credentials.",
        })
    } catch (error) {
        console.error("activateLeadPromotion error:", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

// View credential history (admin only)
export async function getCredentialHistory(req: Request, res: Response) {
    try {
        const admin = (req as any).user
        if (admin.role !== "ADMIN") return res.status(403).json({ message: "Forbidden" })

        const history = await CredentialHistory.find()
            .populate("userId", "name email role")
            .populate("promotedBy", "name email")
            .sort({ promotedAt: -1 })
            .lean()

        return res.status(200).json({ message: "Credential history fetched", history })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}
