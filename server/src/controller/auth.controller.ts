import { Request, Response } from "express";
import { connectToMongo } from "../config/mongodb.js";
import { zodLoginSchema, zodUserSchema } from "../validate/user.zod.js";
import User from "../models/user.schema.js";
import bcrypt from "bcrypt"
import { createSession } from "../config/session.js";
import Session from "../models/session.schema.js";
import { env } from "../config/env.js";
import { isValidDomain } from "../utils/domain.js";
import Company from "../models/company.schema.js";


const PERSONAL_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com']

export async function registerUser(req: Request, res: Response){
    try {
        const parsedData = zodUserSchema.parse(req.body)

        const { name, email, password } = parsedData

        const existingUser = await User.findOne({
            email
        })

        if(existingUser){
            return res.status(400).json({
                message: "User already exists"
            })
        }

        const salt = 12
        const hashedPassword = await bcrypt.hash(password, salt)

        const emailDomain = email.split('@')[1].toLowerCase()
        const userType = PERSONAL_DOMAINS.includes(emailDomain) ? 'personal' : 'company'

        let assignedRole = "USER"
        let companyId = null


        
        if(userType === "company"){
            const domainExists = await isValidDomain(emailDomain)

            if(!domainExists){
                return res.status(400).json({ message: "Company domain not recognized. Please use a valid company email." })
            }

            let company = await Company.findOne({domain: emailDomain})

            if(!company){
                company = await Company.create({
                    name: emailDomain.split(".")[0],
                    domain: emailDomain,
                    isVerified: false
                })
            }

            companyId = company._id

            const existingCompanyUser = await User.findOne({ emailDomain, userType: "company" })
            if (!existingCompanyUser) {
                assignedRole = "LEAD"
            }
        }

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            emailDomain,
            userType,
            role: assignedRole,
            companyId: companyId ? companyId.toString() : undefined
        })

        if (assignedRole === "LEAD" && companyId) {
            await Company.findByIdAndUpdate(companyId, {
                primaryLeadId: newUser._id
            })
        }

        res.status(200).json({
            message: "User registered Successfully",
            userId: newUser._id,
            role: newUser.role,
            userType: newUser.userType
        })

    } catch (error: any) {
        res.status(400).json({
            message: error.message
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
            return res.status(400).json({
                message: "User does not exists"
            })
        }

        const validPassword = await bcrypt.compare(password, existingUser?.password)

        if(!validPassword){
            return res.status(400).json({
                message: "Password is not valid"
            })
        }

        // Session Handling

        const { sessionId, expiresAt } = await createSession(existingUser.id)


        res.cookie("user_session", sessionId, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
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
                userType: existingUser.userType
            },
            sessionId
        })
        

    } catch (error: any) {
        res.status(400).json({
            message: error.message
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
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/"
    })

    return res.status(200).json({
        message: "Logout successful"
    })
}

export async function getCurrentUser(req: Request, res: Response) {
    const user = (req as any).user

    try {
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