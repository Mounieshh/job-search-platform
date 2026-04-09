import * as z from "zod"

export const postJobSchema = z.object({
    roleTitle: z.string().min(1, "Role title is required").max(100, "Role title is too long"),
    companyName: z.string().min(1, "Company name is required").max(100, "Company name is too long"),
    employmentType: z.string().min(1, "Employment type is required"),
    location: z.string().min(1, "Location is required").max(100, "Location is too long")
})

export const postTiptapSchema = z.object({
    url: z.string().url().min(1, "link needed for submission"),
    description: z.string()
        .min(1, "Description is required")
        .refine(val => val !== '<p></p>', { 
            message: "Description cannot be empty" 
        })
})


export type PostJobFormData = z.infer<typeof postJobSchema>
export type PostTipTapData = z.infer<typeof postTiptapSchema>
