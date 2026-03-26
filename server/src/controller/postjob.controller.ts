import { Request, Response } from "express";
import { ZodError } from "zod";
import { postJobSchema, stepTwoSchema } from "../validate/postjob.zod.js";
import { prisma } from "../config/prisma.js";



// Job creation
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

        const job = await prisma.postJob.update({
            where: { id: jobId as string },
            data: {
                ...parsedData,
                draftStats: "published"
            }
        })

        res.json({ success: true, job })

    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ message: "Some sort of zod error" })
        }
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

// Job Browsing Route
export async function getApprovedJobs(req: Request, res: Response){

    try {
        
        const fetchApprovedJobs = await prisma.postJob.findMany({
            where: {
                status: "approved"
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return res.status(200).json({
            message: "Jobs fetched",
            jobs: fetchApprovedJobs
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// Get Single Job
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
        
        if (!fetchSingleJob) {
            return res.status(404).json({ message: "Job not found" })
        }

        console.log("description type:", typeof fetchSingleJob.description)
        console.log("description value:", fetchSingleJob.description)

        return res.status(200).json({
            message: "Single Job based on Id fetched..",
            job: fetchSingleJob
        })

    } catch (error) {
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