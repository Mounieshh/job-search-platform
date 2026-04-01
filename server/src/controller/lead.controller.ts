import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import Company from "../models/company.schema.js";
import UserProfile from "../models/profile.schema.js";
import User from "../models/user.schema.js";
import { leadRequestSchema } from "../validate/lead.zod.js";
import { LeadRequest } from "../models/leadRequest.schema.js";
import * as z from "zod"
import { getLeadUserIdsFromCompany } from "../utils/companyLeads.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "../config/env.js";



export async function getPendingJobApprovals(req: Request, res: Response){
    try {
        
        const user = (req as any).user

        if(user.role !== "LEAD"){
            return res.status(401).json({
                warning: "Authorized People Only"
            })
        }

        let company = null as any
        const companyId = user.company?.companyId
        if (companyId) {
            company = await Company.findById(companyId)
        }

        if (!company) {
            company = await Company.findOne({ primaryLeadId: user._id })
        }

        if (!company) {
            return res.status(404).json({ message: "Company not found" })
        }

        if (!company.primaryLeadId || String(company.primaryLeadId) !== String(user._id)) {
            return res.status(403).json({ message: "You are not the primary lead of this company" })
        }

        const pendingJobs = await prisma.postJob.findMany({
            where: {
                status: "pending",
                companyId: String(company._id),
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

//
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

// approve and reject the user requets
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

        if (!job.companyId) {
            return res.status(400).json({ message: "Job has no company" })
        }

        const company = await Company.findById(job.companyId)
        if (!company) {
            return res.status(404).json({ message: "Company not found" })
        }

        if (!company.primaryLeadId || String(company.primaryLeadId) !== String(user._id)) {
            return res.status(403).json({ message: "You are not the primary lead of this company" })
        }

        await prisma.jobApproval.deleteMany({
            where: { jobId, action: "pending" },
        })

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

export async function getJobApprovalInfo(req: Request, res: Response) {
    try {
        const { jobId } = req.params as { jobId: string }

        const approval = await prisma.jobApproval.findFirst({
            where: { jobId, action: { in: ["approved", "rejected"] } },
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

//list the lead posted jobs
export async function listLeadPostedJobs(req: Request, res: Response){
    try {
        
        const user = (req as any).user

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: No user found" });
        }

        if(user.role !== "LEAD"){
            return res.status(401).json({
                message: "Forbidden: Only leads can access this"
            })
        }


        const fetchJobs = await prisma.postJob.findMany({
            where: {
                userId: user._id
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return res.status(200).json({
            message: "Lead Posted Jobs fetched..",
            fetchJobs
        })
    } catch (error) {
        console.error("Error in listLeadPostedJobs:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

//list the applied jobs from the user
export async function getLeadPostedJobApplications(req: Request, res: Response) {
    try {
        const user = (req as any).user

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        if (user.role !== "LEAD") {
            return res.status(403).json({ message: "Forbidden: Only leads can access this" })
        }

        const jobs = await prisma.postJob.findMany({
            where: {
                userId: String(user._id)
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        if (jobs.length === 0) {
            return res.status(200).json({
                message: "No posted jobs found",
                jobs: []
            })
        }

        const jobIds = jobs.map((job) => job.id)

        const applications = await prisma.userApplication.findMany({
            where: {
                jobId: {
                    in: jobIds
                }
            },
            select: {
                jobId: true,
            }
        })
        const applicationsCountByJob = new Map<string, number>()

        for (const application of applications) {
            const currentCount = applicationsCountByJob.get(application.jobId) || 0
            applicationsCountByJob.set(application.jobId, currentCount + 1)
        }

        const jobsWithApplications = jobs.map((job) => {
            return {
                ...job,
                applicationsCount: applicationsCountByJob.get(job.id) || 0,
            }
        })

        return res.status(200).json({
            message: "Lead job applications fetched successfully",
            jobs: jobsWithApplications,
        })
    } catch (error) {
        console.error("Error in getLeadPostedJobApplications:", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export async function getLeadApplicationsForJob(req: Request, res: Response) {
    try {
        const user = (req as any).user

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        if (user.role !== "LEAD") {
            return res.status(403).json({ message: "Forbidden: Only leads can access this" })
        }

        const { jobId } = req.params as { jobId: string }
        const page = Math.max(1, Number(req.query.page) || 1)
        const limit = Math.max(1, Math.min(50, Number(req.query.limit) || 10))
        const skip = (page - 1) * limit

        const job = await prisma.postJob.findFirst({
            where: {
                id: jobId,
                userId: String(user._id),
            },
        })

        if (!job) {
            return res.status(404).json({ message: "Job not found for this lead" })
        }

        const [totalApplications, applications] = await Promise.all([
            prisma.userApplication.count({
                where: { jobId },
            }),
            prisma.userApplication.findMany({
                where: { jobId },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
        ])

        const applicantUserIds = Array.from(new Set(applications.map((application) => application.userId)))
        const applicantProfileIds = Array.from(new Set(applications.map((application) => application.profileId)))

        const [applicants, applicantProfiles] = await Promise.all([
            User.find({
                _id: { $in: applicantUserIds }
            }).select("_id name email role"),
            UserProfile.find({
                _id: { $in: applicantProfileIds }
            }).select("_id userId phone location resumeUrl workExperience education skills publicLinks"),
        ])

        const applicantMap = new Map(
            applicants.map((applicant) => [String(applicant._id), applicant])
        )

        const profileMap = new Map(
            applicantProfiles.map((profile) => [String(profile._id), profile])
        )

        const mappedApplications = applications.map((application) => ({
            ...application,
            applicant: applicantMap.get(application.userId) || null,
            profile: profileMap.get(application.profileId) || null,
        }))

        const totalPages = Math.max(1, Math.ceil(totalApplications / limit))

        return res.status(200).json({
            message: "Lead job applications fetched successfully",
            job,
            applications: mappedApplications,
            pagination: {
                page,
                limit,
                total: totalApplications,
                totalPages,
            },
        })
    } catch (error) {
        console.error("Error in getLeadApplicationsForJob:", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export async function shortlistTopApplications(req: Request, res: Response) {
    try {
        const user = (req as any).user

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        if (user.role !== "LEAD") {
            return res.status(403).json({ message: "Forbidden: Only leads can access this" })
        }

        if (!GEMINI_API_KEY) {
            return res.status(400).json({ message: "Gemini API key is not configured" })
        }

        const { jobId } = req.params as { jobId: string }

        const job = await prisma.postJob.findFirst({
            where: {
                id: jobId,
                userId: String(user._id),
            },
        })

        if (!job) {
            return res.status(404).json({ message: "Job not found for this lead" })
        }

        const applications = await prisma.userApplication.findMany({
            where: { jobId },
            orderBy: { createdAt: "desc" },
        })

        if (applications.length === 0) {
            return res.status(200).json({
                message: "No applications found for this job",
                shortlisted: [],
            })
        }

        const applicantUserIds = Array.from(new Set(applications.map((application) => application.userId)))
        const applicantProfileIds = Array.from(new Set(applications.map((application) => application.profileId)))

        const [applicants, applicantProfiles] = await Promise.all([
            User.find({
                _id: { $in: applicantUserIds }
            }).select("_id name email role"),
            UserProfile.find({
                _id: { $in: applicantProfileIds }
            }).select("_id userId phone location resumeUrl workExperience education skills publicLinks"),
        ])

        const applicantMap = new Map(
            applicants.map((applicant) => [String(applicant._id), applicant])
        )

        const profileMap = new Map(
            applicantProfiles.map((profile) => [String(profile._id), profile])
        )

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

        const targetCount = Math.min(10, candidatePayload.length)

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

        const prompt = `
You are an ATS shortlist assistant.
Given one job and candidates, pick top ${targetCount} candidates by match quality.

Return strict JSON only with this shape:
{
  "shortlisted": [
    { "applicationId": "string", "score": 0, "reason": "short reason" }
  ]
}

Rules:
- score must be integer 0-100
- return exactly ${targetCount} items if enough candidates exist
- no markdown, no extra text

Job:
${JSON.stringify({
    roleTitle: job.roleTitle,
    companyName: job.companyName,
    employmentType: job.employmentType,
    location: job.location,
    description: job.description || "",
})}

Candidates:
${JSON.stringify(candidatePayload)}
`

        const result = await model.generateContent(prompt)
        const raw = result.response.text().trim()

        const jsonMatch = raw.match(/\{[\s\S]*\}/)
        const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw) as {
            shortlisted?: Array<{ applicationId: string; score: number; reason?: string }>
        }

        const validIds = new Set(applications.map((application) => application.id))

        const shortlisted = (parsed.shortlisted || [])
            .filter((item) => validIds.has(item.applicationId))
            .slice(0, targetCount)

        const shortlistedMap = new Map(
            shortlisted.map((item) => [item.applicationId, Math.max(0, Math.min(100, Math.round(Number(item.score) || 0)))]),
        )

        await Promise.all(
            applications.map((application) =>
                prisma.userApplication.update({
                    where: { id: application.id },
                    data: shortlistedMap.has(application.id)
                        ? { status: "shortlisted", aiScore: shortlistedMap.get(application.id)! }
                        : { status: "pending" },
                }),
            ),
        )

        return res.status(200).json({
            message: "Top applications shortlisted successfully",
            shortlisted,
            totalApplications: applications.length,
            shortlistedCount: shortlisted.length,
        })
    } catch (error) {
        console.error("Error in shortlistTopApplications:", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}