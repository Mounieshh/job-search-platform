import { Router } from "express";
import { loginUser, registerUser, logoutUser, getCurrentUser } from "../controller/auth.controller.js";
import { authorize } from "../middleware/auth.middleware.js";

const router = Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/logout", logoutUser)
router.get("/me", authorize, getCurrentUser)

export default router