import { NextFunction, Request, Response } from "express";
import Session from "../models/session.schema.js";

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

    if(!session || session.expiresAt < new Date()){
        return res.status(401).json({
            message: "Session expired or invalid"
        })
    }

    (req as any).userId = session.userId

    next()
}