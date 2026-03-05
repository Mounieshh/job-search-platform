import { Router } from "express";
import { createJob, getJobListing, getPendingJobs } from "../controller/job.controller.js";
import { authorize, requireRoute } from "../middleware/auth.middleware.js";


const jobRouter = Router()


jobRouter.post("/add", authorize, requireRoute("LEAD", "ADMIN", "USER"), createJob)
jobRouter.get("/", getJobListing)
jobRouter.get("/admin/pending", authorize, requireRoute("ADMIN"), getPendingJobs)


export default jobRouter