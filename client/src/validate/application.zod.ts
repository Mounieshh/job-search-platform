import * as z from "zod"


export const applicationSchema = z.object({
    resume: z
        .instanceof(File, { message: "Resume is required" })
        .refine((file) => file.type === "application/pdf", {
            message: "Only PDF resumes are supported",
        }),
    githubLink: z
        .string()
        .trim()
        .optional()
        .or(z.literal(""))
        .refine((value) => !value || /^https?:\/\//.test(value), {
            message: "GitHub link must start with http:// or https://",
        })
})


export type ApplicationFormData = z.infer<typeof applicationSchema>