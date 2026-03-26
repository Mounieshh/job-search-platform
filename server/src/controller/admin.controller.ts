
import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import User from "../models/user.schema.js";


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