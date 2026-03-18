import * as z from "zod";

const optionalPosition = z.enum([
  "software_engineer", "frontend_developer", "backend_developer",
  "fullstack_developer", "hr_manager", "recruiter",
  "team_lead", "engineering_manager", "other",
]).optional();

const optionalCompanyName = z
  .string()
  .optional()
  .transform((value) => {
    const trimmed = value?.trim();
    return trimmed ? trimmed : undefined;
  })
  .refine((value) => !value || value.length <= 50, {
    message: "String must contain at most 50 character(s)",
  });

export const zodRegisterSchema = z.object({
  name: z.string().min(1).max(50),
  email: z.string().trim().email(),
  password: z.string().min(6).max(20),
  accountType: z.enum(["job_seeker", "company_employee"]),
  companyName: optionalCompanyName,
  position: optionalPosition,
}).superRefine((data, ctx) => {
  if (data.accountType === "company_employee") {
    if (!data.companyName) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Company name is required", path: ["companyName"] });
    }
    if (!data.position) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Position is required", path: ["position"] });
    }
  }
});
export const zodLoginSchema = z.object({
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").max(50)
})


export type ZodUserRegisterInput = z.input<typeof zodRegisterSchema>
export type ZodUserFormData = z.output<typeof zodRegisterSchema>
export type ZodUserLoginData = z.infer<typeof zodLoginSchema>