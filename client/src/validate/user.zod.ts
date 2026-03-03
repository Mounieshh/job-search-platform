import * as z from "zod";

export const zodUserSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(50),
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").max(50),
});


export const zodLoginSchema = z.object({
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").max(50)
})


export type ZodUserFormData = z.infer<typeof zodUserSchema>
export type ZodUserLoginData = z.infer<typeof zodLoginSchema>