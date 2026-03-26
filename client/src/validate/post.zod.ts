import * as z from "zod"

export const postJobSchema = z.object({
    roleTitle: z.string().min(1, "Press the key much faster").max(100, "Press the Key slower"),
    companyName: z.string().min(1, "Company Name must be entered").max(100, "Company name should be stronger"),
    employmentType: z.string().min(1, "Enter the type"),
    location: z.string().min(1, "Location is to be entered").max(100, "Location is far more away")
})

export const postTiptapSchema = z.object({
    url: z.string().min(1, "link needed for submission"),
    description: z.string()
        .min(1, "Description is required")
        .refine(val => val !== '<p></p>', { 
            message: "Description cannot be empty" 
        })
})


export type PostJobFormData = z.infer<typeof postJobSchema>
export type PostTipTapData = z.infer<typeof postTiptapSchema>
