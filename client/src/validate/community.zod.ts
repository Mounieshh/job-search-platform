import * as z from "zod"

export const communitySchema = z.object({
    title: z.string().min(1, "Don't have a name?").max(50, "You're name is too longer"),
    content: z.string().trim().min(1, "Community wants you to speak louder").max(5000, "Content is too long"),
    images: z.array(z.instanceof(File)).max(3).optional().default([])
})


export type CommunityFormData = z.input<typeof communitySchema>