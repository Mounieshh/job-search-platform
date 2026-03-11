import * as z from "zod"

export const jobSchema = z.object({
  title:          z.string().min(1, "Title is required"),
  companyName:    z.string().min(1, "Company name is required"),
  summary:        z.string().optional(),
  description:    z.string().optional(),
  url:            z.string().url("Enter a valid URL").optional().or(z.literal("")),
  location:       z.string().optional(),
  salary:         z.string().optional(),
  employmentType: z.string().optional(),
  requirements:   z.array(z.string()),
  duties:         z.array(z.string()),
})

export type JobFormData = z.infer<typeof jobSchema>