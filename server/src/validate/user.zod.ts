import * as z from "zod";

export const zodRegisterSchema = z.object({
  name: z.string().min(1).max(50),
  email: z.string().trim().email(),
  password: z.string().min(6).max(20),
});

export const zodLoginSchema = z.object({
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").max(50)
});

export const zodForgotPasswordSchema = z.object({
  email: z.string().trim().email("Invalid email address")
})

export const zodResetPasswordSchema = z.object({
  token: z.string().trim().min(1, "Token is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters").max(50)
})
