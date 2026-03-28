import { Router } from "express";
import { authorize, requireRoute } from "../middleware/auth.middleware.js";
import { getJobApprovalInfo, getLeadApprovedJobs, getPendingJobApprovals, leadReviewJob } from "../controller/lead.controller.js";


const leadRouter = Router()

// lead approval
leadRouter.get("/job-requests/pending", authorize, requireRoute("LEAD"), getPendingJobApprovals)
leadRouter.patch("/review/:jobId", authorize, requireRoute("LEAD"), leadReviewJob)
leadRouter.get("/approval-info/:jobId", authorize, requireRoute("LEAD", "ADMIN"), getJobApprovalInfo)

// lead approved job listing
leadRouter.get("/approved-by-me", authorize, requireRoute("LEAD"), getLeadApprovedJobs)

export default leadRouter