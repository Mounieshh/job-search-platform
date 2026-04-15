import { Router } from "express";
import {
	forgotPassword,
	getCurrentUser,
	loginUser,
	logoutUser,
	registerUser,
	resetPassword,
	verifyEmail,
	changePassword,
} from "../controller/auth.controller.js";
import { authorize } from "../middleware/auth.middleware.js";

const router = Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/logout", logoutUser)
router.get("/me", authorize, getCurrentUser)
router.get("/verify-email", verifyEmail)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)
router.post("/change-password", authorize, changePassword)

export default router