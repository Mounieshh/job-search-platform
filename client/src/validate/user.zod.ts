import * as z from "zod";

export const zodRegisterSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").max(20, "Password must be under 20 characters"),
});
export const zodLoginSchema = z.object({
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").max(50)
})


export type ZodUserRegisterInput = z.input<typeof zodRegisterSchema>
export type ZodUserFormData = z.output<typeof zodRegisterSchema>
export type ZodUserLoginData = z.infer<typeof zodLoginSchema>