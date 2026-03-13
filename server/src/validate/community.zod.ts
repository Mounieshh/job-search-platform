import * as z from "zod"

export const communitySchema = z.object({
    content: z.string().min(1).max(255),
    images: z.array(z.string()).default([])
})
