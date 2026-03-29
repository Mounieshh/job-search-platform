import * as z from "zod"

const workExperienceItemSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  location: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  description: z.string().optional(),
})

const educationItemSchema = z.object({
  college: z.string().min(1),
  degree: z.string().min(1),
  department: z.string().optional(),
  startingFrom: z.coerce.date(),
  endingIn: z.coerce.date(),
  score: z.string().optional(),
  description: z.string().optional(),
})

const publicLinksSchema = z.object({
  github: z.union([z.string().url(), z.literal("")]).optional(),
  linkedin: z.union([z.string().url(), z.literal("")]).optional(),
  portfolio: z.union([z.string().url(), z.literal("")]).optional(),
})

export const updateProfileSchema = z
  .object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    skills: z.array(z.string()).optional(),
    workExperience: z.array(workExperienceItemSchema).optional(),
    education: z.array(educationItemSchema).optional(),
    publicLinks: publicLinksSchema.optional(),
    resumeUrl: z.union([z.string().url(), z.literal("")]).optional(),
  })
  .strict()

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
