import nodemailer from "nodemailer";
import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, APP_ORIGIN } from "../config/env.js";

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: false,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});

const FROM = `"Vettd" <${SMTP_USER}>`;

export async function sendVerificationEmail(email: string, name: string, token: string) {
    const verificationUrl = `${APP_ORIGIN}/auth/verify-email?token=${token}`;

    await transporter.sendMail({
        from: FROM,
        to: email,
        subject: "Verify your email",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333;">Welcome to Vettd, ${name}!</h1>
                <p style="font-size: 16px; color: #555;">
                    Please verify your email by clicking the button below:
                </p>
                <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0;">
                    Verify Email
                </a>
                <p style="font-size: 14px; color: #888;">
                    Or copy and paste this link in your browser:<br/>
                    <a href="${verificationUrl}">${verificationUrl}</a>
                </p>
                <p style="font-size: 14px; color: #888; margin-top: 20px;">
                    This link will expire in 24 hours.
                </p>
            </div>
        `,
    });
}

export async function sendResetEmail(email: string, token: string) {
    const passwordResetUrl = `${APP_ORIGIN}/auth/password-reset/${token}`;

    await transporter.sendMail({
        from: FROM,
        to: email,
        subject: "Reset your password",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333;">Reset your Vettd password</h1>
                <p style="font-size: 16px; color: #555;">
                    Click the button below to reset your password:
                </p>
                <a href="${passwordResetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0;">
                    Reset Password
                </a>
                <p style="font-size: 14px; color: #888;">
                    Or copy and paste this link in your browser:<br/>
                    <a href="${passwordResetUrl}">${passwordResetUrl}</a>
                </p>
                <p style="font-size: 14px; color: #888; margin-top: 20px;">
                    This link will expire in 1 hour.
                </p>
            </div>
        `,
    });
}

export async function sendLeadCredentialsEmail(
    newEmail: string,
    name: string,
    plainPassword: string,
    companyName: string,
    position: string
) {
    const loginUrl = `${APP_ORIGIN}/auth/login`

    await transporter.sendMail({
        from: FROM,
        to: newEmail,
        subject: "You're now a Lead on Vettd — your new login credentials",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="border-left: 4px solid #10b981; padding-left: 20px; margin-bottom: 24px;">
                    <h1 style="color: #111; margin: 0 0 6px 0;">Welcome to the Lead program, ${name}!</h1>
                    <p style="color: #555; margin: 0;">Your account has been upgraded to Lead status.</p>
                </div>

                <p style="font-size: 15px; color: #444; line-height: 1.6;">
                    Your admin has approved your request to represent <strong>${companyName}</strong> as <strong>${position}</strong>.
                    A new set of login credentials has been created for your lead account.
                </p>

                <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 24px 0;">
                    <p style="margin: 0 0 12px 0; font-weight: 700; color: #111; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Your new login credentials</p>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 100px;">Email</td>
                            <td style="padding: 8px 0; color: #111; font-size: 14px; font-weight: 600;">${newEmail}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Password</td>
                            <td style="padding: 8px 0; color: #111; font-size: 14px; font-weight: 600; font-family: monospace; letter-spacing: 0.05em;">${plainPassword}</td>
                        </tr>
                    </table>
                </div>

                <p style="font-size: 13px; color: #ef4444; line-height: 1.5;">
                    Your previous login credentials have been deactivated. Please use the credentials above going forward.
                    We recommend changing your password after your first login.
                </p>

                <div style="margin-top: 28px;">
                    <a href="${loginUrl}" style="display: inline-block; padding: 12px 28px; background-color: #111; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
                        Log in to Vettd
                    </a>
                </div>

                <p style="font-size: 12px; color: #9ca3af; margin-top: 32px; border-top: 1px solid #f3f4f6; padding-top: 16px;">
                    This is an automated message from Vettd. If you did not expect this, please contact support immediately.
                </p>
            </div>
        `,
    })
}
export async function sendApplicationStatusEmail(
    email: string,
    applicantName: string,
    jobTitle: string,
    companyName: string,
    status: string,
    reason?: string
) {
    const statusMessages = {
        shortlisted: {
            subject: `Good news about your application for ${jobTitle}`,
            title: "You've been shortlisted!",
            message: `Your application for ${jobTitle} at ${companyName} has been shortlisted. The hiring team will be in touch soon.`,
            color: "#10b981",
        },
        rejected: {
            subject: `Update on your application for ${jobTitle}`,
            title: "Application update",
            message: `Thank you for applying to ${jobTitle} at ${companyName}. After careful review, we've decided to move forward with other candidates.`,
            color: "#ef4444",
        },
        ai_suggested: {
            subject: `Your application for ${jobTitle} is being reviewed`,
            title: "Application under review",
            message: `Your application for ${jobTitle} at ${companyName} is currently being reviewed by the hiring team.`,
            color: "#f59e0b",
        },
    };

    const config = statusMessages[status as keyof typeof statusMessages] ?? statusMessages.ai_suggested;

    await transporter.sendMail({
        from: FROM,
        to: email,
        subject: config.subject,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="border-left: 4px solid ${config.color}; padding-left: 20px; margin-bottom: 20px;">
                    <h1 style="color: #333; margin: 0 0 10px 0;">${config.title}</h1>
                    <p style="color: #666; margin: 0;">Hi ${applicantName},</p>
                </div>

                <p style="font-size: 16px; color: #555; line-height: 1.6;">
                    ${config.message}
                </p>

                ${reason ? `
                    <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin: 20px 0;">
                        <p style="margin: 0 0 8px 0; font-weight: 600; color: #374151;">Feedback from the team:</p>
                        <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">${reason}</p>
                    </div>
                ` : ""}

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    <a href="${APP_ORIGIN}/track-applications" style="display: inline-block; padding: 12px 24px; background-color: ${config.color}; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
                        View All Applications
                    </a>
                </div>

                <p style="font-size: 12px; color: #9ca3af; margin-top: 30px;">
                    This is an automated notification from Vettd.
                </p>
            </div>
        `,
    });
}
