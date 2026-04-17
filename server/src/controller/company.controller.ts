import { Request , Response} from "express";
import Company from "../models/company.schema.js";
import User from "../models/user.schema.js";
import { prisma } from "../config/prisma.js";

export async function getCompanyList(req: Request, res: Response) {
    try {
        const companies = await Company.find()

        const result = []

        for(const company of companies) {
            const companyUserCount = await User.countDocuments({
                "company.companyId": company._id
            })

            const leadUserCount = await User.countDocuments({
                "company.companyId": company._id,
                role: "LEAD"
            })

            const normalUserCount = await User.countDocuments({
                "company.companyId": company._id,
                role: "USER"
            })

            const jobPostCount = await prisma.postJob.count({
                where: {
                    companyId: company._id.toString(),
                }
            })

            result.push({
                id: company._id,
                name: company.name,
                companyUsers: companyUserCount,
                leadUsers: leadUserCount,
                normalUsers: normalUserCount,
                totalJobs: jobPostCount
            })
        }

        return res.status(200).json({
            message: "Company List Fetched",
            result
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export async function getCompanyUsersList(req: Request, res: Response){
    try {
        const { companyId } = req.params

        const company = await Company.findById(companyId).select("userIds").lean()
        if (!company) {
            return res.status(404).json({
                message: "Company not found"
            })
        }

        if (!company.userIds || company.userIds.length === 0) {
            return res.status(200).json({
                message: "Company Users Fetched",
                users: []
            })
        }

        const users = await User.find({
            _id: {
                $in: company.userIds
            }
        })
            .select("_id name email isEmailVerified role company")
            .lean()

        return res.status(200).json({
            message: "Company Users Fetched",
            users
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export async function getAdminCompanyDirectory(req: Request, res: Response) {
    try {
        const companies = await Company.find().lean()

        const payload = []

        for (const company of companies) {
            const byCompanyField = await User.find({
                "company.companyId": company._id,
            })
                .select("_id name email isEmailVerified role company")
                .lean()

            const byUserIds =
                company.userIds && company.userIds.length > 0
                    ? await User.find({ _id: { $in: company.userIds } })
                          .select("_id name email isEmailVerified role company")
                          .lean()
                    : []

            const map = new Map<string, (typeof byCompanyField)[0]>()
            for (const u of byUserIds) {
                map.set(String(u._id), u)
            }
            for (const u of byCompanyField) {
                map.set(String(u._id), u)
            }

            const users = Array.from(map.values())

            const jobPostCount = await prisma.postJob.count({
                where: {
                    companyId: company._id.toString(),
                },
            })

            payload.push({
                id: String(company._id),
                name: company.name,
                totalJobs: jobPostCount,
                primaryLeadId: company.primaryLeadId
                    ? String(company.primaryLeadId)
                    : null,
                members:
                    (company as { members?: { userId: unknown; role: string }[] }).members?.map(
                        (m) => ({
                            userId: String(m.userId),
                            role: m.role,
                        })
                    ) ?? [],
                users,
            })
        }

        return res.status(200).json({
            message: "Admin company directory fetched",
            companies: payload,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
        })
    }
}