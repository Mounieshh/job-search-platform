import * as z from "zod"

export const applicationSchema = z.object({
    resume: z.string().url("Resume URL is required"),
    githubLink: z.string().optional()
})