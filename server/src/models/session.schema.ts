import mongoose, { Schema, Document } from "mongoose";

export interface ISession extends Document {
  sessionId: string;
  userId: string;
  expiresAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    userId: {
      type: String,
      ref: "User",
      required: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

const Session = mongoose.model<ISession>("Session", sessionSchema);
export default Session;