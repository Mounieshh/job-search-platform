import mongoose, { Document, Schema } from "mongoose";

export interface IPasswordResetToken extends Document {
    userId: mongoose.Types.ObjectId;
    token: string;
    expiresAt: Date;
    email: string
}



const passwordResetToken = new Schema<IPasswordResetToken>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        token: {
            type: String,
            required: true,
            unique: true
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true
    }
)


passwordResetToken.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
passwordResetToken.index({ userId: 1 });

const PasswordResetToken = mongoose.model<IPasswordResetToken>("PasswordReset", passwordResetToken)

export default PasswordResetToken