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

export async function getJobsToApproveLead(req: Request, res: Response){
    try {

        const user = (req as any).user

        if(user.role !== "LEAD"){
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        const companyId = user.company?.companyId
        if(!companyId){
            return res.status(400).json({
                message: "No company associated with this account"
            })
        }

        const company = await Company.findById(companyId)
        if(!company){
            return res.status(404).json({
                message: "Company not found"
            })
        }

        const pendingJobs = await prisma.job.findMany({
            where: {
                status: "pending",
                companyName: company.name
            }
        })

        return res.status(200).json({
            message: "Fetched Lead Details Successfully",
            jobs: pendingJobs
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


export async function leadApprove(req: Request, res: Response){
    try {
        
        const user = (req as any).user
        const { id } = req.params

        if (typeof id !== "string") {
            return res.status(400).json({
                message: "Invalid job ID"
            })
        }

        if(user.role !== "LEAD"){
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        const job = await prisma.job.findUnique({ where: { id } })
        if(!job){
            return res.status(404).json({ message: "Job not found" })
        }

        const approval = await prisma.jobApproval.upsert({
            where: { jobId: id },
            update: {
                approvedById: user._id.toString(),
                approvedRole: user.role,
                approvedAt: new Date(),
                rejectedReason: null,
                rejectedAt: null
            },
            create: {
                jobId: id,
                approvedById: user._id.toString(),
                approvedRole: user.role,
                approvedAt: new Date()
            }
        })

        await prisma.job.update({
            where: { id },
            data: {
                status: "approved"
            }
        })

        return res.status(200).json({
            message: "Job Approved",
            approval
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


export async function leadReject(req: Request, res: Response){
    try {
        const user = (req as any).user

        const { id } = req.params
        const { reason } = req.body

        if(user.role !== "LEAD"){
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        if (typeof id !== "string") {
            return res.status(400).json({
                message: "Invalid job ID"
            })
        }

        if(!reason || typeof reason !== "string" || !reason.trim()){
            return res.status(400).json({ message: "Rejection reason is required" })
        }

        const job = await prisma.job.findUnique({ where: { id } })
        if(!job){
            return res.status(404).json({ message: "Job not found" })
        }

        const rejection = await prisma.jobApproval.upsert({
            where: { jobId: id },
            update: {
                approvedById: user._id.toString(),
                approvedRole: user.role,
                rejectedReason: reason.trim(),
                rejectedAt: new Date(),
                approvedAt: null
            },
            create: {
                jobId: id,
                approvedById: user._id.toString(),
                approvedRole: user.role,
                rejectedReason: reason.trim(),
                rejectedAt: new Date()
            }
        })

        await prisma.job.update({
            where: { id },
            data: {
                status: "rejected",
                rejectedReason: reason.trim()
            }
        })


        return res.status(200).json({
            message: "Job Rejected",
            rejection
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export async function getLeadDetailListings(req: Request, res: Response){
    try {
        
        const rawCompanyName = req.params.companyName
        const rawSlugId = req.params.slugId


        const companyName = Array.isArray(rawCompanyName) ? rawCompanyName[0] : rawCompanyName
        const slugId = Array.isArray(rawSlugId) ? rawSlugId[0] : rawSlugId

        if(!slugId || !companyName){
            return res.status(400).json({
                message: "Company Name and Slug are required"
            })
        }

        const decodedCompanyName = decodeURIComponent(companyName)
        const decodedSlugId = decodeURIComponent(slugId)

        const jobs = await prisma.job.findMany({
            where: {
                companyName: {
                    equals: decodedCompanyName,
                    mode: "insensitive"
                },
            }
        })

        const job = jobs.find((item) => toSlug(item.title) === decodedSlugId)

        if(!job){
            return res.status(404).json({
                message: "Job not found"
            })
        }

        let user = null
        if(job.postedBy){
            user = await User.findById(job.postedBy).select(
                "_id name email accountType role company"
            )
        }

        return res.status(200).json({
            message: "Job Fetched Successfully",
            job: {
                ...job,
                user
            }
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export async function getLeadApprovedJobs(req: Request, res: Response){
    try {
        const user = (req as any).user

        if(user.role !== "LEAD"){
            return res.status(401).json({
                message: "Unauthorized"
            })
        }


        const approvedJobs = await prisma.job.findMany({
            where: {
                approval: {
                    some: {
                        approvedById: user._id.toString()
                    }
                }
            },
            include: {
                approval: true
            }
        })

        return res.status(200).json({
            message: "Approved Jobs Fetched Successfully",
            jobs: approvedJobs
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}