import { Request, Response } from "express";

export async function getUserProfile(req: Request, res: Response){
    try {
        
        const user = (req as any).user

        if(!user){
            res.status(401).json({
                message: "Unauthorized"
            })
        }

        return res.status(200).json({
            message: "User Fetched Sucessfully",
            user
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export async function createUserProfile(req: Request, res: Response){
    try {
        
        const user = (req as any).user

        if(!user){
            return res.status(403).json({
                message: "Forbidden"
            })
        }

        
    } catch (error) {
        
    }
}