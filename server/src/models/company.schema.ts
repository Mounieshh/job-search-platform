import mongoose, { Schema, Document } from "mongoose";

export interface ICompany extends Document {
  name: string;
  primaryLeadId: mongoose.Types.ObjectId | null;
  userIds: mongoose.Types.ObjectId[];
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
  },
  { timestamps: true }
);

const Company = mongoose.model<ICompany>("Company", companySchema);

export default Company;