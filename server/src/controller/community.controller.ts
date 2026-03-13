import { Request, Response } from "express";
import { communitySchema } from "../validate/community.zod.js";
import cloudinary from "../config/cloudinary.js";
import { prisma } from "../config/prisma.js";
import fs from "fs/promises"

export async function createCommunityPost(req: Request, res: Response){
    try {

        const parsedData = communitySchema.parse(req.body)

        const user = (req as any).user

        if(!user){
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        let imageUrls : string[] = []

        if(req.files) {
            const files = req.files as Express.Multer.File[]

            for(const file of files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "community_posts"
                })

                imageUrls.push(result.secure_url)
                await fs.unlink(file.path).catch(() => null)
            }
        }

        const post = await prisma.communityPost.create({
            data: {
                content: parsedData.content.trim(),
                images: imageUrls,
                postedUser: user._id.toString()
            }
        })

        return res.status(201).json({
            message: "Community post Created",
            post
        })
    } catch (error: any) {
        return res.status(400).json({
            message: error.message || "Invalid Request"
        })
    }
}


export async function getCommunityPost(req: Request, res: Response){
    try {
        const getPosts = await prisma.communityPost.findMany()

        return res.status(200).json({
            mesasge : "Community Posts Fetched",
            getPosts
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}