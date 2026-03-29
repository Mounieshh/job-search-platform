import { Router } from "express";
import {
  getUserProfile,
  createLeadRequest,
  getLeadRequest,
  updateUserProfile,
} from "../controller/profile.controller.js";
import { authorize, requireRoute } from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.get("/profile", authorize, requireRoute("USER", "LEAD"), getUserProfile);
userRouter.patch("/profile", authorize, requireRoute("USER", "LEAD"), updateUserProfile);

userRouter.post("/request-as-lead", authorize, requireRoute("USER"), createLeadRequest);
userRouter.get("/lead-status", authorize, requireRoute("USER"), getLeadRequest);

export default userRouter;
