import mongoose, { Schema, Document } from "mongoose";

export interface ICompanyMember {
  userId: mongoose.Types.ObjectId;
  role: "lead" | "primary_lead";
}

export interface ICompany extends Document {
  name: string;
  primaryLeadId: mongoose.Types.ObjectId | null;
  userIds: mongoose.Types.ObjectId[];
  members: ICompanyMember[];
}

const companySchema = new Schema<ICompany>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    primaryLeadId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    userIds: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },

    members: {
      type: [
        {
          userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
          role: { type: String, enum: ["lead", "primary_lead"], required: true },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const Company = mongoose.model<ICompany>("Company", companySchema);

export default Company;
