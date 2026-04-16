import mongoose, { Schema, Document } from "mongoose";

export interface IWorkExperience {
  company: string;
  role: string;
  location: string;
  startDate: Date;
  endDate?: Date;       
  description: string;
}

export interface IEducation {
  college: string;
  degree: string;
  department: string;
  startingFrom: Date;
  endingIn: Date;
  score?: string;           
  description?: string;
}

export interface IPublicLinks {
  github?: string;
  linkedin?: string;
  portfolio?: string;
}

export interface IUserProfile extends Document {
  userId: mongoose.Types.ObjectId;
  phone?: string;         
  location?: string;
  avatarUrl?: string;
  resumeUrl?: string;
  resumeParsedText?: string;
  workExperience: IWorkExperience[];
  education: IEducation[];
  publicLinks: IPublicLinks;
  skills: string[];
}

const workExperienceSchema = new Schema<IWorkExperience>({
  company: { type: String, required: true },
  role: { type: String, required: true },
  location: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  description: { type: String }
});

const educationSchema = new Schema<IEducation>({
  college: { type: String, required: true },
  degree: { type: String, required: true },
  department: { type: String },
  startingFrom: { type: Date, required: true },
  endingIn: { type: Date, required: true },
  score: { type: String },
  description: { type: String }
});

const publicLinksSchema = new Schema<IPublicLinks>({
  github: { type: String },
  linkedin: { type: String },
  portfolio: { type: String }
});

const profileSchema = new Schema<IUserProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    phone: { type: String },
    location: { type: String },
    avatarUrl: { type: String },
    resumeUrl: { type: String },
    resumeParsedText: { type: String },
    workExperience: [workExperienceSchema],
    education: [educationSchema],
    publicLinks: { type: publicLinksSchema, default: {} },
    skills: { type: [String], default: [] }
  },
  { timestamps: true }
);

const UserProfile = mongoose.model<IUserProfile>("UserProfile", profileSchema);

export default UserProfile