import * as z from "zod"

export const communitySchema = z.object({
    title: z.string().min(1).max(50),
    content: z.string().min(1).max(255),
    images: z.array(z.string()).default([])
})
