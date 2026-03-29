import * as z from "zod"

export const leadRequestSchema = z.object({
    companyName: z.string(),
    companyEmail: z.email(),
    position: z.string(),
    message: z.string()
})
