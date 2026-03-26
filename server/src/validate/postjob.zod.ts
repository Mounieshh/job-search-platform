import * as z from "zod"

export const postJobSchema = z.object({
    roleTitle: z.string(),
    companyName: z.string(),
    employmentType: z.string(),
    location: z.string()
})

export const stepTwoSchema = z.object({
    url: z.string(),
    description: z.string()
})