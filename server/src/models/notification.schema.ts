import mongoose, { Schema, Document } from "mongoose"

export interface INotification extends Document {
    userId: string
    type: "shortlisted" | "rejected" | "application_received" | "general"
    title: string
    message: string
    isRead: boolean
    meta?: {
        jobId?: string
        applicationId?: string
        jobTitle?: string
        companyName?: string
    }
    createdAt: Date
    updatedAt: Date
}

const notificationSchema = new Schema<INotification>(
    {
        userId: { type: String, required: true, index: true },
        type: {
            type: String,
            enum: ["shortlisted", "rejected", "application_received", "general"],
            required: true,
        },
        title: { type: String, required: true },
        message: { type: String, required: true },
        isRead: { type: Boolean, default: false },
        meta: {
            jobId: String,
            applicationId: String,
            jobTitle: String,
            companyName: String,
        },
    },
    { timestamps: true }
)

export const Notification = mongoose.model<INotification>("Notification", notificationSchema)
