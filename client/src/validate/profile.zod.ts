import * as z from "zod"

export const identitySchema = z.object({
  name: z.string().min(1),
})

export const personalSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().optional(),
})

export const skillsFormSchema = z.object({
  skillsText: z.string(),
})

const workItemSchema = z.object({
  company: z.string(),
  role: z.string(),
  location: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  description: z.string().optional(),
})

export const workExperienceFormSchema = z.object({
  items: z.array(workItemSchema),
})

const educationItemSchema = z.object({
  college: z.string(),
  degree: z.string(),
  department: z.string().optional(),
  startingFrom: z.string(),
  endingIn: z.string(),
  score: z.string().optional(),
  description: z.string().optional(),
})

export const educationFormSchema = z.object({
  items: z.array(educationItemSchema),
})

export const publicLinksFormSchema = z.object({
  github: z.union([z.string().url(), z.literal("")]),
  linkedin: z.union([z.string().url(), z.literal("")]),
  portfolio: z.union([z.string().url(), z.literal("")]),
})

export type IdentityFormData = z.infer<typeof identitySchema>
export type PersonalFormData = z.infer<typeof personalSchema>
export type SkillsFormData = z.infer<typeof skillsFormSchema>
export type WorkExperienceFormData = z.infer<typeof workExperienceFormSchema>
export type EducationFormData = z.infer<typeof educationFormSchema>
export type PublicLinksFormData = z.infer<typeof publicLinksFormSchema>
