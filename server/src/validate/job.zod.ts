import * as z from "zod"


export const jobSchema = z.object({
  title:       z.string().min(1, "Title is required"),
  companyName: z.string().min(1, "Company name is required"),
  description: z.string().optional(),
  url:         z.string().url("Enter a valid URL").optional(),
  location:    z.string().optional(),
  salary:      z.string().optional(),
  source:      z.enum(["internal", "external"]).default("internal"),
})

export type JobFormData = z.infer<typeof jobSchema>