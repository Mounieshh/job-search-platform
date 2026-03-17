import { Request, Response } from "express";
import { jobSchema } from "../validate/job.zod.js";
import { prisma } from "../config/prisma.js";
import User from "../models/user.schema.js";

function toSlug(value: string){
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
}

export async function createJob(req: Request, res: Response) {
  try {

    const user = (req as any).user
    const parsedData = jobSchema.parse(req.body)

    const {
      title,
      summary,
      description,
      companyName,
      url,
      location,
      salary,
      requirements,
      duties,
      employmentType
    } = parsedData

    const companyId = user.company?.companyId?.toString()

    const existingJob = await prisma.job.findFirst({
      where: {
        title,
        companyId,
        location,
        employmentType,
        status: {
          in: ["pending", "approved"]
        }
      }
    })

    if (existingJob) {
      return res.status(409).json({
        message: "Similar job already exists for this company and location"
      })
    }

    const isLead = user.role === "LEAD" || user.role === "ADMIN"

    const createdUser = await User.findById(user._id).select(
      "_id name email role accountType"
    )

    const newJob = await prisma.job.create({
      data: {
        title,
        summary,
        description,
        companyName,
        url: url || "",
        location,
        salary,
        status: isLead ? "approved" : "pending",
        employmentType,
        requirements: requirements || [],
        duties: duties || [],
        postedBy: user._id.toString(),
        companyId: companyId || null
      }
    })

        await prisma.jobApproval.create({
            data: {
                jobId: newJob.id,
                approvedById: isLead ? user._id.toString() : null,
                approvedByName: isLead ? user.name : null,
                approvedRole: isLead ? user.role : null,
                approvedAt: isLead ? new Date() : null,
            }
        })

    return res.status(201).json({
      message: isLead
        ? "Job Posted Successfully"
        : "Job Submitted for Approval",
      job: newJob,
      user: createdUser
    })

  } catch (error: any) {

    return res.status(400).json({
      message: error.message
    })

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
        const user = (req as any).user
        const { id } = req.params

        if (typeof id !== "string") {
            return res.status(400).json({
                message: "Invalid job ID"
            })
        }

        await prisma.job.update({
            where: {
                id : id as string
            },
            data: {
                status: "approved"
            }
        })

        await prisma.jobApproval.upsert({
            where: { jobId: id },
            update: {
                approvedById: user._id.toString(),
                approvedByName: user.name,
                approvedRole: user.role,
                approvedAt: new Date(),
                rejectedById: null,
                rejectedByName: null,
                rejectedReason: null,
                rejectedAt: null
            },
            create: {
                jobId: id,
                approvedById: user._id.toString(),
                approvedByName: user.name,
                approvedRole: user.role,
                approvedAt: new Date()
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
        const user = (req as any).user
        const { id } = req.params
        const { reason } = req.body

        if (typeof id !== "string") {
            return res.status(400).json({
                message: "Invalid job ID"
            })
        }

        if(!reason || typeof reason !== "string" || !reason.trim()){
            return res.status(400).json({ message: "Rejection reason is required" })
        }

        await prisma.job.update({
            where: {
                id: id as string
            },
            data: {
                status: "rejected",
                rejectedReason: reason.trim()
            }
        })

        await prisma.jobApproval.upsert({
            where: { jobId: id },
            update: {
                rejectedById: user._id.toString(),
                rejectedByName: user.name,
                rejectedReason: reason.trim(),
                rejectedAt: new Date(),
                approvedById: null,
                approvedByName: null,
                approvedRole: null,
                approvedAt: null
            },
            create: {
                jobId: id,
                rejectedById: user._id.toString(),
                rejectedByName: user.name,
                rejectedReason: reason.trim(),
                rejectedAt: new Date()
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


export async function getApprovedRejectedJobs(req: Request,  res: Response){
    try {
        const getJobs = await prisma.job.findMany({
            where: {
                status: {
                    in : ["approved", "rejected"]
                }
            },
            include: {
                approval: true
            },
            orderBy: {
                updatedAt: "desc"
            }
        })

        const jobs = getJobs.map((job) => {
            const latestApproval = job.approval[0] ?? null

            return {
                ...job,
                approvedBy: latestApproval?.approvedByName ?? null,
                rejectedBy: latestApproval?.rejectedByName ?? null,
                approvedAt: latestApproval?.approvedAt ?? null,
                rejectedAt: latestApproval?.rejectedAt ?? null,
            }
        })

        return res.status(200).json({
            message: "Approved and Rejected Jobs Listed",
            jobs
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


export async function getUserPostedJobs(req: Request, res: Response){
    try {

        const user = (req as any).user

        const userPostedJobs = await prisma.job.findMany({
            where: {
                postedBy: user._id.toString()
            },
            include: {
                approval: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        const jobs = userPostedJobs.map((job) => {
            const latestApproval = job.approval[0] ?? null

            return {
                ...job,
                approvedBy: latestApproval?.approvedByName ?? null,
                rejectedBy: latestApproval?.rejectedByName ?? null,
                approvedAt: latestApproval?.approvedAt ?? null,
                rejectedAt: latestApproval?.rejectedAt ?? null,
            }
        })

        return res.status(200).json({
            message: "User Posted Jobs Fetched Successfully",
            userPostedJobs: jobs
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


export async function getJobPostById(req: Request, res: Response){
    try {
        const rawCompanyName = req.params.companyName
        const rawSlugId = req.params.slugId

        const companyName = Array.isArray(rawCompanyName)
            ? rawCompanyName[0]
            : rawCompanyName

        const slugId = Array.isArray(rawSlugId)
            ? rawSlugId[0]
            : rawSlugId

        if(!companyName || !slugId){
            return res.status(400).json({
                message: "Company name and slug are required"
            })
        }

        const decodedCompanyName = decodeURIComponent(companyName)
        const decodedSlugId = decodeURIComponent(slugId)

        const jobs = await prisma.job.findMany({
            where: {
                status: "approved",
                companyName: {
                    equals: decodedCompanyName,
                    mode: "insensitive"
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        const job = jobs.find((item) => toSlug(item.title) === decodedSlugId)

        if(!job){
            return res.status(404).json({
                message: "Job not found"
            })
        }

        return res.status(200).json({
            message: "Job fetched successfully",
            job
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


export async function getJobPostByIdAdmin(req: Request, res: Response){
    try {
        const rawCompanyName = req.params.companyName
        const rawSlugId = req.params.slugId

        const companyName = Array.isArray(rawCompanyName)
            ? rawCompanyName[0]
            : rawCompanyName

        const slugId = Array.isArray(rawSlugId)
            ? rawSlugId[0]
            : rawSlugId

        if(!companyName || !slugId){
            return res.status(400).json({
                message: "Company name and slug are required"
            })
        }

        const decodedCompanyName = decodeURIComponent(companyName)
        const decodedSlugId = decodeURIComponent(slugId)

        // Admin can see all jobs regardless of status
        const jobs = await prisma.job.findMany({
            where: {
                companyName: {
                    equals: decodedCompanyName,
                    mode: "insensitive"
                }
            },
            orderBy: {
                createdAt: "desc"
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
            message: "Job fetched successfully",
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
