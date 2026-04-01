import { Router } from "express";
import { authorize, requireRoute } from "../middleware/auth.middleware.js";
import { getJobApprovalInfo, getLeadApplicationsForJob, getLeadApprovedJobs, getLeadPostedJobApplications, getPendingJobApprovals, leadReviewJob, listLeadPostedJobs, shortlistTopApplications } from "../controller/lead.controller.js";


const leadRouter = Router()

// lead approval
leadRouter.get("/job-requests/pending", authorize, requireRoute("LEAD"), getPendingJobApprovals)
leadRouter.patch("/review/:jobId", authorize, requireRoute("LEAD"), leadReviewJob)
leadRouter.get("/approval-info/:jobId", authorize, requireRoute("LEAD", "ADMIN"), getJobApprovalInfo)

// lead approved job listing
leadRouter.get("/approved-by-me", authorize, requireRoute("LEAD"), getLeadApprovedJobs)

//lead posted jobs
leadRouter.get("/posted", authorize, requireRoute("LEAD"), listLeadPostedJobs)
leadRouter.get("/posted/applications", authorize, requireRoute("LEAD"), getLeadPostedJobApplications)
leadRouter.get("/posted/:jobId/applications", authorize, requireRoute("LEAD"), getLeadApplicationsForJob)
leadRouter.post("/posted/:jobId/applications/shortlist", authorize, requireRoute("LEAD"), shortlistTopApplications)

export default leadRouter