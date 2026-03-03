import { NextFunction, Request, Response } from "express";
import Session from "../models/session.schema.js";
import User from "../models/user.schema.js";

export async function authorize(req: Request, res: Response, next: NextFunction){

    const sessionId = req.cookies.user_session

    if(!sessionId){
        return res.status(401).json({
            message: "Unauthorized - No session found"
        })
    }

    const session = await Session.findOne({
        sessionId
    })

    if (!session || session.expiresAt < new Date()) {
        if (session) await Session.deleteOne({ sessionId });
        return res.status(401).json({ message: "Session expired - Please login again" });
    }

    const user = await User.findById(session.userId).select("-password")

    if(!user){
        return res.status(400).json({ message: "User not found" })
    }

    (req as any).userId = session.userId

    next()
}


export async function requireRoute(...roles: string[]){
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user

        if(!roles.includes(user.role)){
            return res.status(403).json({
                message: "Forbidden - Insufficient Permissions"
            })
        }

        next()
    }
}