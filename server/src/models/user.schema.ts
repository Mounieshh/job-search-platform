import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  accountType: "job_seeker" | "company_employee";
  role: "USER" | "LEAD" | "ADMIN";

  company?: {
    companyId: mongoose.Types.ObjectId;
    companyName: string
    position:
      | "software_engineer"
      | "frontend_developer"
      | "backend_developer"
      | "fullstack_developer"
      | "hr_manager" 
      | "recruiter"
      | "team_lead"
      | "engineering_manager"
      | "other";
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

    accountType: {
      type: String,
      enum: ["job_seeker", "company_employee"],
      required: true,
    },

    role: {
      type: String,
      enum: ["USER", "LEAD", "ADMIN"],
      default: "USER",
    },

    company: {
      companyId: {
        type: Schema.Types.ObjectId,
        ref: "Company"
      },
      companyName: {
        type: String,
        required: false
      },
      position: {
        type: String,
        enum: [
          "software_engineer",
          "frontend_developer",
          "backend_developer",
          "fullstack_developer",
          "hr_manager",
          "recruiter",
          "team_lead",
          "engineering_manager",
          "other",
        ],
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;