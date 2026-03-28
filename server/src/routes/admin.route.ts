import { Router } from "express";
import { authorize, requireRoute } from "../middleware/auth.middleware.js";
import { adminReviewJob, getAdminApprovedJobs, getAdminPendingJobs, getAdminSingleJob } from "../controller/admin.controller.js";

const adminRouter = Router()


adminRouter.get("/jobs/pending", authorize, requireRoute("ADMIN"), getAdminPendingJobs)
adminRouter.get("/jobs/reviewed", authorize, requireRoute("ADMIN"), getAdminApprovedJobs)
adminRouter.patch("/review/:jobId", authorize, requireRoute("ADMIN"), adminReviewJob)
adminRouter.get("/job/preview/:jobId", authorize, requireRoute("ADMIN"), getAdminSingleJob)

export default adminRouter