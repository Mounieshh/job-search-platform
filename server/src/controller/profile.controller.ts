import { Request, Response } from "express";
import { LeadRequest } from "../models/leadRequest.schema.js";
import z from "zod";
import { leadRequestSchema } from "../validate/lead.zod.js";
import User from "../models/user.schema.js";
import UserProfile from "../models/profile.schema.js";
import { updateProfileSchema } from "../validate/profile.zod.js";

async function ensureProfile(userId: string) {
  let profile = await UserProfile.findOne({ userId });
  if (!profile) {
    profile = await UserProfile.create({
      userId,
      workExperience: [],
      education: [],
      publicLinks: {},
      skills: [],
    });
  }
  return profile;
}

export async function getUserProfile(req: Request, res: Response) {
  try {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const freshUser = await User.findById(user._id).select("-password");
    if (!freshUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = await ensureProfile(freshUser._id.toString());

    return res.status(200).json({
      message: "User fetched successfully",
      user: freshUser,
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function updateUserProfile(req: Request, res: Response) {
  try {
    const user = (req as any).user;

    if (!user) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const parsed = updateProfileSchema.parse(req.body);

    if (parsed.email !== undefined || parsed.name !== undefined) {
      const userUpdate: { name?: string; email?: string } = {};
      if (parsed.name !== undefined) userUpdate.name = parsed.name;
      if (parsed.email !== undefined) {
        const duplicate = await User.findOne({
          email: parsed.email,
          _id: { $ne: user._id },
        });
        if (duplicate) {
          return res.status(409).json({ message: "Email already in use" });
        }
        userUpdate.email = parsed.email;
      }
      if (Object.keys(userUpdate).length > 0) {
        await User.findByIdAndUpdate(user._id, userUpdate);
      }
    }

    const $set: Record<string, unknown> = {};
    if (parsed.phone !== undefined) $set.phone = parsed.phone;
    if (parsed.location !== undefined) $set.location = parsed.location;
    if (parsed.skills !== undefined) $set.skills = parsed.skills;
    if (parsed.workExperience !== undefined)
      $set.workExperience = parsed.workExperience;
    if (parsed.education !== undefined) $set.education = parsed.education;
    if (parsed.publicLinks !== undefined) {
      const existing = await UserProfile.findOne({ userId: user._id }).lean();
      const merged: Record<string, string> = {
        ...((existing?.publicLinks as Record<string, string>) || {}),
      };
      for (const [key, val] of Object.entries(parsed.publicLinks)) {
        if (val === "") delete merged[key];
        else if (val !== undefined) merged[key] = val as string;
      }
      $set.publicLinks = merged;
    }
    if (parsed.resumeUrl !== undefined && parsed.resumeUrl !== "") {
      $set.resumeUrl = parsed.resumeUrl;
    }

    const updateOps: { $set?: Record<string, unknown>; $unset?: Record<string, 1> } =
      {};
    if (Object.keys($set).length > 0) updateOps.$set = $set;
    if (parsed.resumeUrl === "") updateOps.$unset = { resumeUrl: 1 };

    if (updateOps.$set || updateOps.$unset) {
      await UserProfile.findOneAndUpdate(
        { userId: user._id },
        updateOps,
        { upsert: true, new: true }
      );
    }

    const freshUser = await User.findById(user._id).select("-password");
    const profile = await ensureProfile(user._id.toString());

    return res.status(200).json({
      message: "Profile updated",
      user: freshUser,
      profile,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({
        message: "Validation failed",
        errors: error.issues,
      });
    }
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function createLeadRequest(req: Request, res: Response) {
  try {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized. You should Login",
      });
    }

    if (user.role === "LEAD") {
      return res.status(400).json({ message: "You are already a lead." });
    }

    const existingRequest = await LeadRequest.findOne({
      userId: user._id,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(409).json({
        message: "You already having an existing request",
      });
    }

    const validatedData = leadRequestSchema.parse(req.body);

    const leadRequest = await LeadRequest.create({
      userId: user._id,
      companyName: validatedData.companyName,
      companyEmail: validatedData.companyEmail,
      position: validatedData.position,
      message: validatedData.message,
    });

    return res.status(201).json({
      message: "Lead request submitted successfully. It will be reviewed by an admin.",
      leadRequest: {
        id: leadRequest._id,
        companyName: leadRequest.companyName,
        status: leadRequest.status,
        user,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({
        message: "Validation failed",
        errors: error.issues,
      });
    }
    console.error("Error creating lead request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getLeadRequest(req: Request, res: Response) {
  try {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const leadRequest = await LeadRequest.findOne({ userId: user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      message: "Lead request fetched successfully",
      leadRequest,
    });
  } catch (error) {
    console.error("Error fetching lead request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
