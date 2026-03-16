import * as z from "zod";

const optionalCompanyName = z.preprocess(
  (value) => typeof value === "string" && value.trim() === "" ? undefined : value,
  z.string().trim().min(1).max(50).optional()
)

const optionalPosition = z
  .enum([
    "software_engineer",
    "frontend_developer",
    "backend_developer",
    "fullstack_developer",
    "hr_manager",
    "recruiter",
    "team_lead",
    "engineering_manager",
    "other",
  ])
  .optional()

export const zodRegisterSchema = z.object({
    name: z.string().min(1).max(50),
    email: z.string().trim().email(),
    password: z.string().min(6).max(20),
    accountType: z.enum(["job_seeker", "company_employee"]),
    companyName: optionalCompanyName,
    position: optionalPosition,
    company: z
      .object({
        companyName: optionalCompanyName,
        position: optionalPosition,
      })
      .optional(),
      role: z.enum(["USER", "LEAD", "ADMIN"]).optional()
    }).superRefine((data, ctx) => {
      if (data.accountType === "company_employee") {
        const resolvedCompanyName = data.company?.companyName ?? data.companyName
        const resolvedPosition = data.company?.position ?? data.position

        if (!resolvedCompanyName) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Company name is required",
            path: ["companyName"]
          })
        }

        if (!resolvedPosition) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Position is required",
            path: ["position"]
          })
        }
      }
    })

export const zodLoginSchema = z.object({
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").max(50)
})
