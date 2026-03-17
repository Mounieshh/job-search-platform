import { Router } from "express";
import { getUserProfile } from "../controller/profile.controller.js";
import { authorize, requireRoute } from "../middleware/auth.middleware.js";

const userRouter = Router()


userRouter.get("/profile", authorize, requireRoute("USER"), getUserProfile)


export default userRouter