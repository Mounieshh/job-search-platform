import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  mobile?: string;
  emailDomain: string;
  userType: "personal" | "company";
  role: "USER" | "LEAD" | "ADMIN";
  companyId?: string;
  isCompanyVerified: boolean;
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
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    mobile: {
      type: String,
      required: false,
      trim: true,
    },
    emailDomain: {
      type: String,
      required: true
    },
    userType: {
      type: String,
      enum: ["personal", "company"],
      required: true
    },
    role: {
      type: String,
      enum: ["USER", "LEAD", "ADMIN"],
      default: "USER",
    },
    companyId: {
      type: String,
      default: null
    },
    isCompanyVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);


const User = mongoose.model<IUser>("User", userSchema);
export default User