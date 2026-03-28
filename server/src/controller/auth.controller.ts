// auth.controller.ts (updated login and register)
import { Request, Response } from "express";
import { connectToMongo } from "../config/mongodb.js";
import { zodLoginSchema, zodRegisterSchema } from "../validate/user.zod.js";
import User from "../models/user.schema.js";
import bcrypt from "bcrypt";
import { createSession } from "../config/session.js";
import Session from "../models/session.schema.js";
import { isValidDomain } from "../utils/domain.js";
import Company from "../models/company.schema.js";
import { NODE_ENV } from "../config/env.js";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/mail.js";
import VerificationToken from "../models/verificationToken.schema.js";


function getAuthCookieOptions(expiresAt?: Date) {
  const isProduction = NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? ("none" as const) : ("lax" as const),
    expires: expiresAt,
    path: "/",
  };
}

export async function registerUser(req: Request, res: Response) {
  try {
    const parsedData = zodRegisterSchema.parse(req.body);
    const { name, email, password } = parsedData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const createdUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "USER",
    });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await VerificationToken.deleteMany({ email });

    await VerificationToken.create({
      userId: createdUser._id,
      token,
      expiresAt,
      email,
    });

    await sendVerificationEmail(email, name, token);

    return res.status(201).json({
      message: "User registered successfully. Please verify your email.",
    });
    
  } catch (error: any) {
    console.error(error);
    if (error.name === "ZodError") {
      return res.status(422).json({ message: "Validation failed", errors: error.issues });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const parsedData = zodLoginSchema.parse(req.body);
    const { email, password } = parsedData;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    if (!existingUser.isEmailVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in." });
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const { sessionId, expiresAt } = await createSession(existingUser._id.toString());

    res.cookie("user_session", sessionId, getAuthCookieOptions(expiresAt));

    return res.status(200).json({
      message: "Login Successful",
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        isEmailVerified: existingUser.isEmailVerified,
      },
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(422).json({
        message: "Validation Error",
        errors: error.errors,
      });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function logoutUser(req: Request, res: Response) {
  const sessionId = req.cookies.user_session;

  if (sessionId) {
    await Session.deleteOne({ sessionId });
  }

  res.clearCookie("user_session", getAuthCookieOptions());

  return res.status(200).json({ message: "Logout successful" });
}

export async function getCurrentUser(req: Request, res: Response) {
  try {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ message: "Server Error" });
  }
}

export async function verifyEmail(req: Request, res: Response) {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Verification token is required" });
    }

    const userToken = await VerificationToken.findOne({
      token,
      expiresAt: { $gt: new Date() },
    });

    if (!userToken) {
      return res.status(400).json({ message: "Invalid or expired verification token" });
    }

    const user = await User.findById(userToken.userId);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    user.isEmailVerified = true;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}