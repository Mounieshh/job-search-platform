import { raw, Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import Company from "../models/company.schema.js";
import User from "../models/user.schema.js";


function toSlug(value: string){
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
}


// listing pending jobs for lead approval
export async function getPendingJobApprovals(req: Request, res: Response){
    try {
        
        const user = (req as any).user

        if(user.role !== "LEAD"){
            return res.status(401).json({
                warning: "Authorized People Only"
            })
        }

        const companyId = user.company?.companyId
        if(!companyId){
            return res.status(400).json({
                message: "No company associated with the company"
            })
        }

        const company = await Company.findById(companyId)
        if (!company) {
            return res.status(404).json({ message: "Company not found" })
        }


        if (String(company.primaryLeadId) !== String(user._id)) {
            return res.status(403).json({ message: "You are not the primary lead of this company" })
        }

        const pendingJobs = await prisma.postJob.findMany({
            where: {
                status: "pending",
                companyName: company.name
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        const userIds = pendingJobs.map(job => job.userId).filter(Boolean)

        const users = await User.find({
            _id: { $in: userIds }
        })

        const userMap = new Map()

        users.forEach(user => {
            userMap.set(String(user._id), user)
        })

        const jobsWithUsers = pendingJobs.map(job => ({
            ...job,
            user: userMap.get(job.userId) || null
        }))

        return res.status(200).json({
            message: "Fetched Pending Jobs Successfully for Lead Approval",
            jobs: jobsWithUsers
        })

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

//listing approved jobs by lead
export async function getLeadApprovedJobs(req: Request, res: Response) {
    try {
        const user = (req as any).user

        if (user.role !== "LEAD") {
            return res.status(403).json({ message: "Forbidden" })
        }

        const approvals = await prisma.jobApproval.findMany({
            where: {
                leadId: String(user._id),
                action: "approved"
            },
            include: {
                job: true
            },
            orderBy: { createdAt: "desc" }
        })

        const approvedJobs = approvals.map(approval => ({
            ...approval.job,
            approvedAt: approval.createdAt
        }))

        return res.status(200).json({
            message: "Approved jobs fetched successfully",
            jobs: approvedJobs
        })

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

// approving and rejecting the job
export async function leadReviewJob(req: Request, res: Response) {
    try {
        const user = (req as any).user
        const { jobId } = req.params as { jobId: string }
        const { action, reason } = req.body

        if (user.role !== "LEAD") {
            return res.status(403).json({ message: "Forbidden" })
        }

        if (!["approved", "rejected"].includes(action)) {
            return res.status(400).json({ message: "Invalid action. Must be approved or rejected" })
        }

        if (action === "rejected" && !reason?.trim()) {
            return res.status(400).json({ message: "Reason is required when rejecting a job" })
        }

        const job = await prisma.postJob.findUnique({ where: { id: jobId } })
        if (!job) return res.status(404).json({ message: "Job not found" })

        if (job.status !== "pending") {
            return res.status(400).json({ message: "Job has already been reviewed" })
        }

        const companyId = user.company?.companyId
        const company = await Company.findById(companyId)

        if (!company || String(company.primaryLeadId) !== String(user._id)) {
            return res.status(403).json({ message: "You are not the primary lead of this company" })
        }

        if (job.companyName !== company.name) {
            return res.status(403).json({ message: "This job does not belong to your company" })
        }

        const updatedJob = await prisma.postJob.update({
            where: { id: jobId },
            data: { status: action }
        })

        await prisma.jobApproval.create({
            data: {
                jobId,
                leadId: String(user._id),
                leadName: user.name,
                action,
                reason: reason ?? null
            }
        })

        return res.status(200).json({
            message: `Job ${action} successfully`,
            job: updatedJob
        })

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

//job info after approving
export async function getJobApprovalInfo(req: Request, res: Response) {
    try {
        const { jobId } = req.params as { jobId: string }

        const approval = await prisma.jobApproval.findFirst({
            where: { jobId },
            orderBy: { createdAt: "desc" }
        })

        if (!approval) {
            return res.status(200).json({ approval: null })
        }

        return res.status(200).json({
            approval: {
                action: approval.action,
                reason: approval.reason,
                leadName: approval.leadName,
                leadId: approval.leadId,
                createdAt: approval.createdAt
            }
        })

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

