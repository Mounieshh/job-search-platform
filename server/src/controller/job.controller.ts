import { Request, Response } from "express";
import { jobSchema } from "../validate/job.zod.js";
import { prisma } from "../config/prisma.js";
import User from "../models/user.schema.js";

export async function createJob(req: Request, res: Response){
    try {

        const user = (req as any).user
        const parsedData = jobSchema.parse(req.body)

        const { title, description, companyName, url, location, salary, source} = parsedData

        const existingJob = await prisma.job.findFirst({
            where: {
                title,
                companyName
            }
        })

        if(existingJob){
            return res.status(400).json({ message: "This Job already exists"})
        }

        const isLead = user.role === "LEAD" || user.role === "ADMIN"
        
        const createdUser = await User.findById(user._id).select(
            "_id name email emailDomain role userType"
        )
        
        const newJob = await prisma.job.create({
            data: {
                title,
                description,
                companyName,
                url: url || "",
                location,
                salary,
                source: source || "internal",
                status: isLead ? "approved" : "pending",
                postedBy: user._id.toString(),
                companyId: user.companyId ? user.companyId.toString() : null,
            }
        })

        return res.status(200).json({
            message: isLead ? "Job Posted Successfully": "Job Submitted for Approval",
            job: newJob,
            user: createdUser
        })

    } catch (error: any) {
        return res.status(400).json({ message: error.message })
    }   
}

export async function getJobListing(req: Request, res: Response){
    try {
        const jobs = await prisma.job.findMany({
            where: {
                status: "approved"
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return res.status(200).json({
            message: "Job Listings Created",
            jobs
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export async function getPendingJobs(req: Request, res: Response){
    try {

        const pendingjobs = await prisma.job.findMany({
            where: {
                status: "pending"
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        const userIds = pendingjobs.map(job => job.postedBy)

        const users = await User.find({
            _id: {
                $in: userIds
            }
        }).select("_id name email emailDomain userType role")

        const userMap = new Map(users.map(user => [user._id.toString(), user]))

        const jobWithUser = pendingjobs.map(jobs => ({
            ...jobs,
            user: userMap.get(jobs.postedBy) || null
        }))




        return res.status(200).json({
            message: "Pending Jobs Listed for Approval",
            jobs: jobWithUser
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


export async function approvejob(req: Request, res:Response){
    try {
        
        const { id } = req.params

        await prisma.job.update({
            where: {
                id : id as string
            },
            data: {
                status: "approved"
            }
        })

        return res.status(200).json({
            message: "Job Approved"
        })

    } catch (error) {
        return res.status(500).json({
            message: "Server Error"
        })
    }
}

export async function rejectJob(req: Request, res: Response){
    try {
        
        const { id } = req.params
        const { reason } = req.body

        await prisma.job.update({
            where: {
                id: id as string
            },
            data: {
                status: "rejected",
                rejectedReason: reason
            }
        })

        return res.status(200).json({
            message: "Job Rejected"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal  Server Error"
        })
    }
}