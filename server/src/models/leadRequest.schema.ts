import mongoose, { Schema } from "mongoose";


interface ILeadRequest extends Document {
    userId: mongoose.Types.ObjectId,
    companyName: string,
    companyEmail: string,
    position: string,
    message: string,
    status: "pending" | "approved" | "rejected",
    adminComment: string,
    processedAt?: Date,
    processedBy?: mongoose.Types.ObjectId
}

const leadRequestSchema = new Schema<ILeadRequest>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    companyEmail: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    message: {
        type: String
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    adminComment: {
        type: String
    },
    processedAt: {
        type: Date
    },
    processedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

leadRequestSchema.index({ userId: 1, status: 1 }, { unique: true, partialFilterExpression: { status: "pending" } });

export const LeadRequest = mongoose.model<ILeadRequest>("LeadRequest", leadRequestSchema);