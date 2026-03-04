import { Request, Response } from "express";
import { jobSchema } from "../validate/job.zod.js";
import { prisma } from "../config/prisma.js";

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
                companyId: user.companyId ? user.companyId.toString() : null
            }
        })

        return res.status(200).json({
            message: isLead ? "Job Posted Successfully": "Job Submitted for Approval",
            job: newJob
        })

    } catch (error: any) {
        return res.status(400).json({ message: error.message })
    }   
}

