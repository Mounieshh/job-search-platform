import mongoose, { Schema, Document } from "mongoose"

export interface ICredentialHistory extends Document {
    userId: mongoose.Types.ObjectId
    previousEmail: string
    previousPasswordHash: string
    newEmail: string
    reason: "lead_promotion"
    companyName: string
    position: string
    promotedAt: Date
    promotedBy: mongoose.Types.ObjectId
}

const credentialHistorySchema = new Schema<ICredentialHistory>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        previousEmail: { type: String, required: true },
        previousPasswordHash: { type: String, required: true },
        newEmail: { type: String, required: true },
        reason: { type: String, enum: ["lead_promotion"], default: "lead_promotion" },
        companyName: { type: String, required: true },
        position: { type: String, required: true },
        promotedAt: { type: Date, default: Date.now },
        promotedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
)

export const CredentialHistory = mongoose.model<ICredentialHistory>(
    "CredentialHistory",
    credentialHistorySchema
)
