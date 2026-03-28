import { Resend } from "resend";
import { RESEND_API_KEY, APP_ORIGIN } from "../config/env.js";

const resend = new Resend(RESEND_API_KEY);

export async function sendVerificationEmail(email: string, name: string, token: string) {
    const verificationUrl = `${APP_ORIGIN}/auth/verify-email?token=${token}`;

    try {
        await resend.emails.send({
            from: "Job Search Community <onboarding@resend.dev>",
            to: email,
            subject: "Verify your email",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #333;">Welcome to Job Search Community, ${name}!</h1>
                    <p style="font-size: 16px; color: #555;">
                        Please verify your email by clicking the button below:
                    </p>
                    <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0;">
                        Verify Email
                    </a>
                    <p style="font-size: 14px; color: #888;">
                        Or copy and paste this link in your browser: <br/>
                        <a href="${verificationUrl}">${verificationUrl}</a>
                    </p>
                    <p style="font-size: 14px; color: #888; margin-top: 20px;">
                        This link will expire in 24 hours.
                    </p>
                </div>
            `
        });

    } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error("Failed to send verification email");
    }
}
