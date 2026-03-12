import { Router } from "express";
import { authorize, requireRoute } from "../middleware/auth.middleware.js";
import { getJobsToApproveLead, getLeadApprovedJobs, getLeadDetailListings, leadApprove, leadReject } from "../controller/lead.controller.js";


const leadRouter = Router()


leadRouter.get("/requests", authorize, requireRoute("LEAD", "ADMIN"), getJobsToApproveLead)
leadRouter.patch("/approve/:id", authorize, requireRoute("LEAD"), leadApprove)
leadRouter.patch("/reject/:id", authorize, requireRoute("LEAD"), leadReject)
leadRouter.get("/:companyName/:slugId", authorize, requireRoute("LEAD"), getLeadDetailListings)
leadRouter.get("/approved-by-me", authorize, requireRoute("LEAD"), getLeadApprovedJobs)

export default leadRouter