import { Request , Response} from "express";
import Company from "../models/company.schema.js";
import User from "../models/user.schema.js";

export async function getCompanyList(req: Request, res: Response) {
    try {
        const companies = await Company.find()

        const result = []

        for(const company of companies) {
            const count = await User.countDocuments({
                email: { $regex: `@${company.domain}`}
            })

    
            result.push({
                id: company._id,
                name: company.name,
                domain: company.domain,
                companyUsers: count
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