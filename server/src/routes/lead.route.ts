import { Router } from "express";
import { authorize, requireRoute } from "../middleware/auth.middleware.js";
import { getJobsToApproveLead, getLeadDetailListings, leadApprove } from "../controller/lead.controller.js";
import { rejectJob } from "../controller/job.controller.js";


const leadRouter = Router()


leadRouter.get("/requests", authorize, requireRoute("LEAD", "ADMIN"), getJobsToApproveLead)
leadRouter.patch("/approve/:id", authorize, requireRoute("LEAD"), leadApprove)
leadRouter.patch("/reject/:id", authorize, requireRoute("LEAD"), rejectJob)
leadRouter.get("/:companyName/:slugId", authorize, requireRoute("LEAD"), getLeadDetailListings)

export default leadRouter