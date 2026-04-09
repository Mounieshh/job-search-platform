import * as z from "zod"

export const identitySchema = z.object({
  name: z.string().min(1, "Name is required"),
})

export const personalSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  location: z.string().optional(),
})

export const skillsFormSchema = z.object({
  skillsText: z.string().min(1, "Enter at least one skill"),
})

const workItemSchema = z.object({
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  location: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  description: z.string().optional(),
})

export const workExperienceFormSchema = z.object({
  items: z.array(workItemSchema),
})

const educationItemSchema = z.object({
  college: z.string().min(1, "College is required"),
  degree: z.string().min(1, "Degree is required"),
  department: z.string().optional(),
  startingFrom: z.string().min(1, "Start date is required"),
  endingIn: z.string().min(1, "End date is required"),
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
