import { Router } from "express";
import { authorize, requireRoute } from "../middleware/auth.middleware.js";
import { createNewJob, getApprovedJobs, getJobs, getSingleJob, patchNewJob } from "../controller/postjob.controller.js";

const postJobRouter = Router()


postJobRouter.post("/make", authorize, requireRoute("USER", "ADMIN", "LEAD"), createNewJob)
postJobRouter.patch("/make/:jobId", authorize, requireRoute("USER", "ADMIN", "LEAD"), patchNewJob)

// for listing
postJobRouter.get("/", authorize, requireRoute("USER"), getJobs)
postJobRouter.get("/browse", getApprovedJobs)

// for details page
postJobRouter.get("/:jobId", authorize, getSingleJob)



export default postJobRouter