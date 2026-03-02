import { Request, Response } from "express";
import { connectToMongo } from "../config/mongodb.js";
import { zodLoginSchema, zodUserSchema } from "../validate/user.zod.js";
import User from "../models/user.schema.js";
import bcrypt from "bcrypt"


declare module "express-session" {
  interface SessionData {
    userId: string;
    role: "USER" | "LEAD" | "ADMIN";
    name?: string;
    email?: string;
  }
}

export async function registerUser(req: Request, res: Response){
    try {
        await connectToMongo()

        const parsedData = zodUserSchema.parse(req.body)

        const { name, email, password, role} = parsedData

        const existingUser = await User.findOne({
            email
        })

        if(existingUser){
            res.status(400).json({
                message: "User already exists"
            })
        }

        const salt = 12
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role
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

        req.session.userId = existingUser._id.toString()
        req.session.role = existingUser.role

        res.status(201).json({
            message: "Login Sucessful",
            role: existingUser.role 
        })

    } catch (error: any) {
        res.status(400).json({
            message: error.message
        })
    }
}