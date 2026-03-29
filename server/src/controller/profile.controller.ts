import { Request, Response } from "express";
import { LeadRequest } from "../models/leadRequest.schema.js";
import z from "zod";
import { leadRequestSchema } from "../validate/lead.zod.js";
import User from "../models/user.schema.js";

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


//user request to admin for lead
export async function createLeadRequest(req: Request, res: Response){
    try {
        
        const user = (req as any).user

        if(!user){
            return res.status(401).json({
                message: "Unauthorized. You should Login"
            })
        }

        if (user.role === "LEAD") {
            return res.status(400).json({ message: "You are already a lead." });
        }
        
        const existingRequest = await LeadRequest.findOne({
            userId: user._id,
            status: "pending"
        })

        if(existingRequest){
            return res.status(409).json({
                message: "You already having an existing request"
            })
        }

        const validatedData = leadRequestSchema.parse(req.body)


        const leadRequest = await LeadRequest.create({
            userId: user._id,
            companyName: validatedData.companyName,
            companyEmail: validatedData.companyEmail,
            position: validatedData.position,
            message: validatedData.message,
        })


        
        return res.status(201).json({
            message: "Lead request submitted successfully. It will be reviewed by an admin.",
            leadRequest: {
                id: leadRequest._id,
                companyName: leadRequest.companyName,
                status: leadRequest.status,
                user
            },
        });

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(422).json({
                message: "Validation failed",
                errors: error.issues,
            });
        }
        console.error("Error creating lead request:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// admin dashboard lead request
export async function getLeadRequest(req: Request, res: Response) {
    try {
        const user = (req as any).user;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const leadRequest = await LeadRequest.findOne({ userId: user._id }).sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Lead request fetched successfully",
            leadRequest
        });
    } catch (error) {
        console.error("Error fetching lead request:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
