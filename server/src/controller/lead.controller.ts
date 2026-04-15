import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import UserProfile from "../models/profile.schema.js";
import User from "../models/user.schema.js";
import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "../config/env.js";
import { sendApplicationStatusEmail } from "../utils/mail.js";
import { Notification } from "../models/notification.schema.js";

async function createNotification(
    userId: string,
    type: "shortlisted" | "rejected",
    jobTitle: string,
    companyName: string,
    applicationId: string,
    jobId: string
) {
    const isShortlisted = type === "shortlisted"
    await Notification.create({
        userId,
        type,
        title: isShortlisted ? "You've been shortlisted!" : "Application update",
        message: isShortlisted
            ? `Your application for ${jobTitle} at ${companyName} has been shortlisted. The team will reach out soon.`
            : `Your application for ${jobTitle} at ${companyName} was not selected at this time.`,
        meta: { jobId, applicationId, jobTitle, companyName },
    })
}


export async function getPendingJobApprovals(req: Request, res: Response){
    try {
        const user = (req as any).user
        if(user.role !== "LEAD"){
            return res.status(401).json({ warning: "Authorized People Only" })
        }

        const pendingJobs = await prisma.postJob.findMany({
            where: { status: "pending" },
            orderBy: { createdAt: "desc" }
        })

        const userIds = pendingJobs.map(job => job.userId).filter(Boolean)
        const users = await User.find({ _id: { $in: userIds } })
        const userMap = new Map(users.map(u => [String(u._id), u]))

        return res.status(200).json({
            message: "Fetched Pending Jobs Successfully for Lead Approval",
            jobs: pendingJobs.map(job => ({ ...job, user: userMap.get(job.userId ?? "") || null }))
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export async function getLeadApprovedJobs(req: Request, res: Response) {
    try {
        const user = (req as any).user
        if (user.role !== "LEAD") return res.status(403).json({ message: "Forbidden" })

        const approvals = await prisma.jobApproval.findMany({
            where: { leadId: String(user._id), action: "approved" },
            include: { job: true },
            orderBy: { createdAt: "desc" }
        })

        return res.status(200).json({
            message: "Approved jobs fetched successfully",
            jobs: approvals.map(a => ({ ...a.job, approvedAt: a.createdAt }))
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export async function leadReviewJob(req: Request, res: Response) {
    try {
        const user = (req as any).user
        const { jobId } = req.params as { jobId: string }
        const { action, reason } = req.body

        if (user.role !== "LEAD") return res.status(403).json({ message: "Forbidden" })
        if (!["approved", "rejected"].includes(action))
            return res.status(400).json({ message: "Invalid action. Must be approved or rejected" })
        if (action === "rejected" && !reason?.trim())
            return res.status(400).json({ message: "Reason is required when rejecting a job" })

        const job = await prisma.postJob.findUnique({ where: { id: jobId } })
        if (!job) return res.status(404).json({ message: "Job not found" })
        if (job.status !== "pending") return res.status(400).json({ message: "Job has already been reviewed" })

        await prisma.jobApproval.deleteMany({ where: { jobId, action: "pending" } })

        const updatedJob = await prisma.postJob.update({ where: { id: jobId }, data: { status: action } })

        await prisma.jobApproval.create({
            data: { jobId, leadId: String(user._id), leadName: user.name, action, reason: reason ?? null }
        })

        return res.status(200).json({ message: `Job ${action} successfully`, job: updatedJob })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export async function getJobApprovalInfo(req: Request, res: Response) {
    try {
        const { jobId } = req.params as { jobId: string }
        const approval = await prisma.jobApproval.findFirst({
            where: { jobId, action: { in: ["approved", "rejected"] } },
            orderBy: { createdAt: "desc" }
        })

        if (!approval) return res.status(200).json({ approval: null })

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

export async function listLeadPostedJobs(req: Request, res: Response){
    try {
        const user = (req as any).user
        if (!user) return res.status(401).json({ message: "Unauthorized: No user found" })
        if(user.role !== "LEAD") return res.status(401).json({ message: "Forbidden: Only leads can access this" })

        const fetchJobs = await prisma.postJob.findMany({
            where: { userId: user._id },
            orderBy: { createdAt: "desc" }
        })

        return res.status(200).json({ message: "Lead Posted Jobs fetched..", fetchJobs })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
}

export async function getLeadPostedJobApplications(req: Request, res: Response) {
    try {
        const user = (req as any).user
        if (!user) return res.status(401).json({ message: "Unauthorized" })
        if (user.role !== "LEAD") return res.status(403).json({ message: "Forbidden: Only leads can access this" })

        const jobs = await prisma.postJob.findMany({
            where: { userId: String(user._id) },
            orderBy: { createdAt: "desc" }
        })

        if (jobs.length === 0) return res.status(200).json({ message: "No posted jobs found", jobs: [] })

        const jobIds = jobs.map((job) => job.id)
        const applications = await prisma.userApplication.findMany({
            where: { jobId: { in: jobIds } },
            select: { jobId: true }
        })

        const applicationsCountByJob = new Map<string, number>()
        for (const application of applications) {
            applicationsCountByJob.set(application.jobId, (applicationsCountByJob.get(application.jobId) || 0) + 1)
        }

        return res.status(200).json({
            message: "Lead job applications fetched successfully",
            jobs: jobs.map((job) => ({ ...job, applicationsCount: applicationsCountByJob.get(job.id) || 0 }))
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
}

export async function getLeadApplicationsForJob(req: Request, res: Response) {
    try {
        const user = (req as any).user
        if (!user) return res.status(401).json({ message: "Unauthorized" })
        if (user.role !== "LEAD") return res.status(403).json({ message: "Forbidden: Only leads can access this" })

        const { jobId } = req.params as { jobId: string }
        const page = Math.max(1, Number(req.query.page) || 1)
        const limit = Math.max(1, Math.min(50, Number(req.query.limit) || 10))
        const skip = (page - 1) * limit

        const job = await prisma.postJob.findFirst({ where: { id: jobId, userId: String(user._id) } })
        if (!job) return res.status(404).json({ message: "Job not found for this lead" })

        const [totalApplications, applications, statusBuckets] = await Promise.all([
            prisma.userApplication.count({ where: { jobId } }),
            prisma.userApplication.findMany({ where: { jobId }, orderBy: { createdAt: "desc" }, skip, take: limit }),
            prisma.userApplication.groupBy({ by: ["status"], where: { jobId }, _count: { status: true } }),
        ])

        const countsByStatus = statusBuckets.reduce(
            (acc, bucket) => {
                const s = (bucket.status || "").toLowerCase()
                if (s === "shortlisted") acc.shortlisted = bucket._count.status
                else if (s === "rejected") acc.rejected = bucket._count.status
                else if (s === "pending") acc.pending = bucket._count.status
                return acc
            },
            { shortlisted: 0, rejected: 0, pending: 0 }
        )

        const applicantUserIds = Array.from(new Set(applications.map((a) => a.userId)))
        const applicantProfileIds = Array.from(new Set(applications.map((a) => a.profileId)))

        const [applicants, applicantProfiles] = await Promise.all([
            User.find({ _id: { $in: applicantUserIds } }).select("_id name email role"),
            UserProfile.find({ _id: { $in: applicantProfileIds } }).select("_id userId phone location resumeUrl workExperience education skills publicLinks"),
        ])

        const applicantMap = new Map(applicants.map((a) => [String(a._id), a]))
        const profileMap = new Map(applicantProfiles.map((p) => [String(p._id), p]))

        return res.status(200).json({
            message: "Lead job applications fetched successfully",
            job,
            applications: applications.map((a) => ({ ...a, applicant: applicantMap.get(a.userId) || null, profile: profileMap.get(a.profileId) || null })),
            stats: { total: totalApplications, ...countsByStatus },
            pagination: { page, limit, total: totalApplications, totalPages: Math.max(1, Math.ceil(totalApplications / limit)) },
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
}

// Close applications for a job
export async function closeJobApplications(req: Request, res: Response) {
    try {
        const user = (req as any).user
        const { jobId } = req.params as { jobId: string }

        if (user.role !== "LEAD") return res.status(403).json({ message: "Forbidden" })

        const job = await prisma.postJob.findFirst({
            where: { id: jobId, userId: String(user._id) }
        })

        if (!job) return res.status(404).json({ message: "Job not found or not owned by you" })

        if (job.status === "application_closed") {
            return res.status(400).json({ message: "Applications are already closed for this job" })
        }

        const updatedJob = await prisma.postJob.update({
            where: { id: jobId },
            data: { status: "application_closed" }
        })

        return res.status(200).json({ message: "Applications closed successfully", job: updatedJob })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
}

export async function shortlistTopApplications(req: Request, res: Response) {
    try {
        const user = (req as any).user
        if (!user) return res.status(401).json({ message: "Unauthorized" })
        if (user.role !== "LEAD") return res.status(403).json({ message: "Forbidden: Only leads can access this" })
        if (!GEMINI_API_KEY) return res.status(400).json({ message: "Gemini API key is not configured" })

        const { jobId } = req.params as { jobId: string }
        const job = await prisma.postJob.findFirst({ where: { id: jobId, userId: String(user._id) } })
        if (!job) return res.status(404).json({ message: "Job not found for this lead" })

        const applications = await prisma.userApplication.findMany({ where: { jobId }, orderBy: { createdAt: "desc" } })
        if (applications.length === 0) return res.status(200).json({ message: "No applications found for this job", shortlisted: [] })

        const applicantUserIds = Array.from(new Set(applications.map((a) => a.userId)))
        const applicantProfileIds = Array.from(new Set(applications.map((a) => a.profileId)))

        const [applicants, applicantProfiles] = await Promise.all([
            User.find({ _id: { $in: applicantUserIds } }).select("_id name email role"),
            UserProfile.find({ _id: { $in: applicantProfileIds } }).select("_id userId phone location resumeUrl workExperience education skills publicLinks"),
        ])

        const applicantMap = new Map(applicants.map((a) => [String(a._id), a]))
        const profileMap = new Map(applicantProfiles.map((p) => [String(p._id), p]))

        const candidatePayload = applications.map((application) => {
            const applicant = applicantMap.get(application.userId)
            const profile = profileMap.get(application.profileId)
            return {
                applicationId: application.id,
                applicantName: applicant?.name || "",
                applicantEmail: applicant?.email || "",
                githubLink: application.githubLink || "",
                resumeUrl: application.resume || profile?.resumeUrl || "",
                skills: Array.isArray(profile?.skills) ? profile?.skills : [],
                location: profile?.location || "",
                workExperience: Array.isArray(profile?.workExperience) ? profile?.workExperience : [],
                education: Array.isArray(profile?.education) ? profile?.education : [],
                publicLinks: profile?.publicLinks || {},
            }
        })

        const ai = new GoogleGenAI({})
        const prompt = `
You are an expert ATS (Applicant Tracking System) and technical recruiter with 10+ years of experience.

Your task is to analyze the **Job Description** and multiple **Candidate Profiles**, then provide honest, balanced, and actionable suggestions.

For each candidate, evaluate how well they match the job requirements (skills, experience, education, location, employment type, etc.).

Return **strict JSON only** in this exact shape. Do not include any extra text, markdown, or explanations:

{
  "scored": [
    {
      "applicationId": "string",
      "score": 85,
      "reason": "Short, clear reason for the score (1-2 sentences)",
      "suggestions": "Specific suggestions for the recruiter (e.g., strong in React but weak in TypeScript, recommend asking about leadership experience)"
    }
  ]
}

Rules you must strictly follow:
- score must be an integer between 0 and 100
- Higher score = better overall match for this job
- Include exactly one object per candidate (do not skip or add extra)
- Be objective and critical. Do not be overly positive.
- Focus on real matches: technical skills, years of experience, relevant projects, location, employment type, etc.
- "reason" should be concise and professional
- "suggestions" should help the lead/recruiter make a better decision

Job Details:
${JSON.stringify({ roleTitle: job.roleTitle, companyName: job.companyName, employmentType: job.employmentType, location: job.location, description: job.description || "" })}

Candidates Data:
${JSON.stringify(candidatePayload)}
`

        const result = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt, config: { responseMimeType: "application/json" } })
        if (!result.text) return res.status(502).json({ message: "AI response was empty" })

        const response = JSON.parse(result.text)
        if (!response?.scored || !Array.isArray(response.scored))
            return res.status(400).json({ success: false, message: "Invalid AI response format." })

        await prisma.$transaction(
            response.scored.map((application: any) => prisma.userApplication.update({
                where: { id: application.applicationId },
                data: { aiScore: application.score, aiReason: application.reason, aiSuggestions: application.suggestions, status: "ai_suggested" }
            }))
        )

        return res.status(200).json({ message: "Suggestions for the Applications has been generated", response })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
}

export async function manualShortlistByLead(req: Request, res: Response){
    try {
        const user = (req as any).user
        const { action, reason, applicationId } = req.body as { action?: string; reason?: string; applicationId?: string }

        if(!user) return res.status(401).json({ message: "Unauthorized" })
        if (user.role !== "LEAD") return res.status(403).json({ message: "Forbidden: Only leads can access this" })
        if (!applicationId) return res.status(400).json({ message: "applicationId is required" })
        if (!action || !["shortlist", "reject", "rejected"].includes(action))
            return res.status(400).json({ message: "Invalid action. Use 'shortlist' or 'reject'" })

        const application = await prisma.userApplication.findFirst({ where: { id: applicationId } })
        if (!application) return res.status(404).json({ message: "Application not found" })

        const job = await prisma.postJob.findFirst({
            where: { id: application.jobId, userId: String(user._id) },
            select: { id: true }
        })
        if (!job) return res.status(403).json({ message: "You can only review applications for your own posted jobs" })

        if (action === "shortlist") {
            const updated = await prisma.userApplication.update({
                where: { id: application.id },
                data: { status: "shortlisted", rejectionReason: null }
            })

            const jobData = await prisma.postJob.findFirst({ where: { id: application.jobId }, select: { id: true, roleTitle: true, companyName: true } })
            const applicant = await User.findById(application.userId).select("name email")
            if (applicant && jobData) {
                sendApplicationStatusEmail(applicant.email, applicant.name, jobData.roleTitle, jobData.companyName, "shortlisted").catch(() => {})
                createNotification(application.userId, "shortlisted", jobData.roleTitle, jobData.companyName, application.id, jobData.id).catch(() => {})
            }

            return res.status(200).json({ message: "Application shortlisted successfully", application: updated })
        }

        if (!reason?.trim()) return res.status(400).json({ message: "Reason is required when rejecting an application" })

        const updated = await prisma.userApplication.update({
            where: { id: application.id },
            data: { status: "rejected", rejectionReason: reason.trim() }
        })

        const rejectedJob = await prisma.postJob.findFirst({ where: { id: application.jobId }, select: { id: true, roleTitle: true, companyName: true } })
        const rejectedApplicant = await User.findById(application.userId).select("name email")
        if (rejectedApplicant && rejectedJob) {
            sendApplicationStatusEmail(rejectedApplicant.email, rejectedApplicant.name, rejectedJob.roleTitle, rejectedJob.companyName, "rejected", reason.trim()).catch(() => {})
            createNotification(application.userId, "rejected", rejectedJob.roleTitle, rejectedJob.companyName, application.id, rejectedJob.id).catch(() => {})
        }

        return res.status(200).json({ message: "Application rejected successfully", application: updated })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}
