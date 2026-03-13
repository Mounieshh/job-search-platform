import * as z from "zod"

export const communitySchema = z.object({
    title: z.string().min(1).max(50),
    content: z.string().trim().min(1, "Community wants you to speak louder").max(255, "Community wants you to speak slower"),
    images: z.array(z.instanceof(File)).max(3).optional().default([])
})


export type CommunityFormData = z.input<typeof communitySchema>