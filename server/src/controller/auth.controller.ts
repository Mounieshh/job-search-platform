import { Request, Response } from "express";
import { connectToMongo } from "../config/mongodb.js";
import { zodLoginSchema, zodRegisterSchema } from "../validate/user.zod.js";
import User from "../models/user.schema.js";
import bcrypt from "bcrypt"
import { createSession } from "../config/session.js";
import Session from "../models/session.schema.js";
import { isValidDomain } from "../utils/domain.js";
import Company from "../models/company.schema.js";
import { NODE_ENV } from "../config/env.js";


function escapeRegex(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}



export async function registerUser(req: Request, res: Response) {
    
    try {
        const parsedData = zodRegisterSchema.parse(req.body)

        const { name, email, password, accountType, role, company } = parsedData
        const companyName = company?.companyName ?? parsedData.companyName
        const position = company?.position ?? parsedData.position


        if (accountType === "company_employee") {
            const domainMatch = email.match(/@([a-zA-Z0-9.-]+)$/)
            if (!domainMatch) {
                return res.status(400).json({
                    message: "Invalid email format"
                })
            }

            const domain = domainMatch[1]
            const personalDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "mail.com", "protonmail.com", "aol.com"]
            
            if (personalDomains.includes(domain.toLowerCase())) {
                return res.status(400).json({
                    message: "Company employees must register with a company email address, not personal email"
                })
            }
        }

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        let resolvedRole: "USER" | "LEAD" | "ADMIN" = role || "USER"

        if (accountType === "company_employee") {
            resolvedRole = "USER"
        }

        const userData: any = {
            name,
            email,
            password: hashedPassword,
            accountType,
            role: resolvedRole
        }

        if (accountType === "company_employee") {
            const normalizedCompanyName = companyName!.trim()
            const companyNameMatcher = new RegExp(`^${escapeRegex(normalizedCompanyName)}$`, "i")

            let company = await Company.findOne({ name: companyNameMatcher })

            if (!company) {
                company = await Company.create({ name: normalizedCompanyName })
            }

            const isPrimaryLead = !company.primaryLeadId
            userData.role = isPrimaryLead ? "LEAD" : "USER"

            userData.company = {
                companyId: company._id,
                position
            }

            const createdUser = await User.create(userData)

            if (isPrimaryLead) {
                company.primaryLeadId = createdUser._id as any
                await company.save()
            }

            return res.status(201).json({
                message: "User registered successfully"
            })
        }

        await User.create(userData)

        return res.status(201).json({
            message: "User registered successfully"
        })

    } catch (error: any) {

        if (error.name === "ZodError") {
            return res.status(422).json({
                message: "Validation failed",
                errors: error.issues
            })
        }

        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

export async function loginUser(req: Request, res: Response){
    try {

        const parsedData = zodLoginSchema.parse(req.body)

        const { email, password } = parsedData

        const existingUser = await User.findOne({
            email
        })

        if(!existingUser){
            return res.status(401).json({
                message: "Invalid Credentials"
            })
        }

        const validPassword = await bcrypt.compare(password, existingUser?.password)

        if(!validPassword){
            return res.status(401).json({
                message: "Invalid Credentials"
            })
        }

        // Session Handling

        const { sessionId, expiresAt } = await createSession(existingUser._id.toString())


        res.cookie("user_session", sessionId, {
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: "lax",
            expires: expiresAt,
            path: "/"
        })

        return res.status(200).json({
            message: "Login Successful",
            user: {
                id: existingUser.id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role,
                accountType: existingUser.accountType
            }
        })
        

    } catch (error: any) {
        if(error.name === "ZodError"){
            return res.status(422).json({
                message: "Validation Error",
                errors: error.errors
            })
        }


        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export async function logoutUser(req: Request, res: Response) {
    const sessionId = req.cookies.user_session

    if(sessionId){
        await Session.deleteOne({
            sessionId
        })
    }

    res.clearCookie("user_session", {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: "lax",
        path: "/"
    })

    return res.status(200).json({
        message: "Logout successful"
    })
}

export async function getCurrentUser(req: Request, res: Response) {
    

    try {
        const user = (req as any).user

        if(!user){
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        return res.status(200).json({ user })

    } catch (error) {
        res.status(400).json({
            message: "Server Error"
        })
    }
}