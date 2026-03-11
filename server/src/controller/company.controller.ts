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

            const jobPostCount = await prisma.job.count({
                where: {
                    companyId: company._id.toString(),
                }
            })

            result.push({
                id: company._id,
                name: company.name,
                companyUsers: companyUserCount,
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

        const users = await User.find({
            "company.companyId": companyId
        }).select("-password")

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