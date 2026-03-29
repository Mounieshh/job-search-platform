import { z } from "zod";

export const leadRequestSchema = z.object({
    companyName: z.string().min(1, "Company name is required"),
    companyEmail: z.string().email("Invalid company email"),
    position: z.string().min(1, "Position is required"),
    message: z.string().optional(),
});

export type LeadRequestFormData = z.infer<typeof leadRequestSchema>;
