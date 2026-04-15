import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "USER" | "LEAD" | "ADMIN";
  isEmailVerified: boolean;
  mustChangePassword: boolean;
  company?: {
    companyId?: mongoose.Types.ObjectId;
    companyName?: string;
    position?: string;
  };
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    mustChangePassword: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["USER", "LEAD", "ADMIN"],
      default: "USER",
    },
    company: {
      companyId: { type: Schema.Types.ObjectId, ref: "Company" },
      companyName: { type: String },
      position: { type: String },
    },
  },
  { timestamps: true }
);


const User = mongoose.model<IUser>("User", userSchema);

export default User;
