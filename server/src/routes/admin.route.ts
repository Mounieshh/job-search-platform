import { Router } from "express";
import { authorize, requireRoute } from "../middleware/auth.middleware.js";
import { getAdminApprovedJobs, getAdminPendingJobs } from "../controller/admin.controller.js";

const adminRouter = Router()


adminRouter.get("/jobs/pending", authorize, requireRoute("ADMIN"), getAdminPendingJobs)
adminRouter.get("/jobs/reviewed", authorize, requireRoute("ADMIN"), getAdminApprovedJobs)

export default adminRouter