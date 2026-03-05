import { Router } from "express";
import { approvejob, createJob, getJobListing, getPendingJobs, rejectJob } from "../controller/job.controller.js";
import { authorize, requireRoute } from "../middleware/auth.middleware.js";


const jobRouter = Router()


jobRouter.post("/add", authorize, requireRoute("LEAD", "ADMIN", "USER"), createJob)
jobRouter.get("/", getJobListing)
jobRouter.get("/admin/pending", authorize, requireRoute("ADMIN"), getPendingJobs)
jobRouter.patch("/admin/approve/:id", authorize, requireRoute("ADMIN"), approvejob)
jobRouter.patch("/admin/reject/:id", authorize, requireRoute("ADMIN"), rejectJob)


export default jobRouter