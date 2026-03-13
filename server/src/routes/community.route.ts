import { Router } from "express";
import { authorize, requireRoute } from "../middleware/auth.middleware.js";
import { createCommunityPost, getCommunityPost } from "../controller/community.controller.js";
import upload from "../middleware/multer.js";

const communityRouter = Router()

communityRouter.post("/", authorize, requireRoute("USER", "ADMIN", "LEAD"), upload.array("images", 3), createCommunityPost)
communityRouter.get("/", authorize, requireRoute("USER", "LEAD", "ADMIN"), getCommunityPost)

export default communityRouter