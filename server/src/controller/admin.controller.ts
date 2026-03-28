
import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import User from "../models/user.schema.js";
import Company from "../models/company.schema.js";


// list pending jobs
export async function getAdminPendingJobs(req: Request, res: Response){
    try {
        
        const user = (req as any).user

        if(user.role !== "ADMIN"){
            return res.status(403).json({
                message: "Forbidden"
            })
        }

        const pendingJobs = await prisma.postJob.findMany({
            where: {
                status: "pending"
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        const userIds = [...new Set(pendingJobs.map(job => job.userId).filter(Boolean))]
        
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
            message: "Pending jobs for admin fetched Successfully",
            jobs: jobsWithUsers
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

// list approved and rejected jobs
export async function getAdminApprovedJobs(req: Request, res: Response){
    try {
        const user = (req as any).user

        if(user.role !== "ADMIN"){
            return res.status(403).json({
                warning: "!!Forbidden"
            })
        }

        const approvedJobs = await prisma.postJob.findMany({
            where: {
                status: {
                    in: ["approved", "rejected"]
                },
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        const userIds = [...new Set(approvedJobs.map(job => job.userId).filter(Boolean))]
        
        const users = await User.find({
            _id: { $in: userIds }
        })

        const userMap = new Map()

        users.forEach(user => {
            userMap.set(String(user._id), user)
        })
        
        const jobsWithUsers = approvedJobs.map(job => ({
            ...job,
            user: userMap.get(job.userId) || null
        }))


        return res.status(200).json({
            message: "Approved Jobs for admin fetched Successfully",
            jobs: jobsWithUsers
        })
        
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

// admin approving and rejecting jobs
export async function adminReviewJob(req: Request, res: Response){
    try {
        
        const user = (req as any).user
        const { jobId } = req.params as {jobId: string}
        const { action, reason } = req.body


        if(user.role !== "ADMIN"){
            return res.status(403).json({
                message: "Forbidden"
            })
        }

        if(!["approved", "rejected"].includes(action)){
            return res.status(400).json({
                message: "Invalid Action. Must be approved or rejected"
            })
        }

        if(action === "rejected" && !reason?.trim()){
            return res.status(400).json({
                message: "Reason is required when rejecting a job"
            })
        }

        const job = await prisma.postJob.findUnique({
            where: {
                id: jobId
            }
        })

       if(!job){
            return res.status(404).json({
                message: "Job not found"
            })
       }

        if(job.status !== "pending"){
                return res.status(400).json({
                    message: "Job has already been reviewed"
                })
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
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

// Get Single job for admin
export async function getAdminSingleJob(req: Request, res: Response){
    try {
        
        const user = (req as any).user
        const { jobId } = req.params

        if(user.role !== "ADMIN"){
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        if(!jobId){
            return res.status(404).json({
                message: "Job not found"
            })
        }

        const fetchJob = await prisma.postJob.findUnique({
            where: {
                id: jobId as string
            }
        })

        const jobUser = fetchJob?.userId 
                    ? await User.findById(fetchJob.userId).select("_id name email isEmailVerified company role")
                    : null

        const combineJobwithUser = {
            ...fetchJob,
            user: jobUser ?? null
        }

        return res.status(200).json({
            message: "Single Job based on Id Fetched for Admin",
            job: combineJobwithUser
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }   
}