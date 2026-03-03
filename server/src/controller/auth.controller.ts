import { Request, Response } from "express";
import { connectToMongo } from "../config/mongodb.js";
import { zodLoginSchema, zodUserSchema } from "../validate/user.zod.js";
import User from "../models/user.schema.js";
import bcrypt from "bcrypt"
import { createSession } from "../config/session.js";
import Session from "../models/session.schema.js";
import { env } from "../config/env.js";


export async function registerUser(req: Request, res: Response){
    try {
        await connectToMongo()

        const parsedData = zodUserSchema.parse(req.body)

        const { name, email, password, role} = parsedData

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

        const isGmail = email.toLowerCase().endsWith("@gmail.com")

        const assignedRole = isGmail ? "USER" : "LEAD"

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: assignedRole
        })

        res.status(200).json({
            message: "User registered Successfully",
            userId: newUser._id
        })

    } catch (error: any) {
        res.status(400).json({
            message: error.message
        })
    }
}


export async function loginUser(req: Request, res: Response){
    try {
        await connectToMongo()

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
                role: existingUser.role
            }
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
    const userId = (req as any).userId

    try {
        const user = await User.findById(userId).select("-password")

        if(!user){
            return res.status(400).json({
                message: "User not found"
            })
        }

        return res.status(200).json({ user })
    } catch (error) {
        res.status(400).json({
            message: "Server Error"
        })
    }
}