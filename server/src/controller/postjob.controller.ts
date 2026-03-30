import { Request, Response } from "express";
import { ZodError } from "zod";
import { postJobSchema, stepTwoSchema } from "../validate/postjob.zod.js";
import { prisma } from "../config/prisma.js";
import Company from "../models/company.schema.js";
import User from "../models/user.schema.js";
import { escapeRegex, getLeadUserIdsFromCompany } from "../utils/companyLeads.js";


export async function createNewJob(req: Request, res: Response) {
    try {
        const parsedData = postJobSchema.parse(req.body)
        const user = (req as any).user

        const job = await prisma.postJob.create({
            data: {
                ...parsedData,
                userId: String(user._id),
                draftStats: "draft"
            }
        })

        res.status(201).json({ jobId: job.id })

    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ message: "Some sort of zod error" })
        }
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export async function patchNewJob(req: Request, res: Response) {
    try {
        const { jobId } = req.params
        const user = (req as any).user
        const parsedData = stepTwoSchema.parse(req.body)

        const existing = await prisma.postJob.findUnique({ where: { id: jobId as string} })

        if (!existing) return res.status(404).json({ message: "Job not found" })
        if (existing.userId !== String(user._id)) return res.status(403).json({ message: "Forbidden" })

        let company = await Company.findOne({
            name: new RegExp(`^${escapeRegex(existing.companyName)}$`, "i"),
        })

        if (!company) {
            const createdCompany = await Company.create({
                name: existing.companyName,
                primaryLeadId: null,
                userIds: [],
                members: [],
            })
            company = createdCompany
        }

        const companyIdStr = company._id.toString()
        const role = user.role as string

        if (role === "USER") {
            const primaryLeadId = company.primaryLeadId ? String(company.primaryLeadId) : null
            const leads = primaryLeadId ? [primaryLeadId] : getLeadUserIdsFromCompany(company)

            const job = await prisma.postJob.update({
                where: { id: jobId as string },
                data: {
                    ...parsedData,
                    draftStats: "published",
                    companyId: companyIdStr,
                    status: "pending",
                },
            })

            await prisma.jobApproval.deleteMany({
                where: { jobId: job.id, action: "pending" },
            })

            for (const leadId of leads) {
                const leadUser = await User.findById(leadId).select("name")
                await prisma.jobApproval.create({
                    data: {
                        jobId: job.id,
                        leadId,
                        leadName: leadUser?.name ?? "Lead",
                        action: "pending",
                        reason: null,
                    },
                })
            }

            return res.json({ success: true, job })
        }

        if (role === "LEAD" || role === "ADMIN") {
            const job = await prisma.postJob.update({
                where: { id: jobId as string },
                data: {
                    ...parsedData,
                    draftStats: "published",
                    companyId: companyIdStr,
                    status: "approved",
                },
            })

            return res.json({ success: true, job })
        }

        return res.status(403).json({ message: "Forbidden" })

    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ message: "Some sort of zod error" })
        }
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export async function getApprovedJobs(req: Request, res: Response){

    try {

        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10
        const skip = (page - 1) * limit
        
        const fetchApprovedJobs = await prisma.postJob.findMany({
            where: {
                status: "approved"
            },
            orderBy: {
                createdAt: "desc"
            },
            skip,
            take: limit
        })

        const totalJobs = await prisma.postJob.count({
            where: {
                status: "approved"
            }
        })

        return res.status(200).json({
            message: "Jobs fetched",
            jobs: fetchApprovedJobs,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalJobs / limit),
                totalJobs
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

export async function getSingleJob(req: Request, res:Response){
    try {
        const user = (req as any).user

        const { jobId } = req.params    
        if(!user){
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        const fetchSingleJob = await prisma.postJob.findUnique({
            where: {
                id: jobId as string
            }
        })

        const postedUser = await User.findById(fetchSingleJob?.userId).select("_id name email role emailVerified")
        
        if (!fetchSingleJob) {
            return res.status(404).json({ message: "Job not found" })
        }

        const combinedData = {
            ...fetchSingleJob,
            postedUser
        }

        return res.status(200).json({
            message: "Single Job based on Id fetched..",
            job: combinedData
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export async function getJobs(req: Request, res: Response){
    try {
        
        const listJobs = await prisma.postJob.findMany({
            where: {
                status: "pending"
            },
            orderBy: {
                createdAt: "desc"
            }
        })


        return res.status(200).json({
            message: "Pending Jobs fetched successfully",
            jobs: listJobs
        })
    } catch (error) {   
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}
