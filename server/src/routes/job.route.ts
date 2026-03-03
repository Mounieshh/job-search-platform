import { Router } from "express";
import { createJob } from "../controller/job.controller.js";
import { authorize, requireRoute } from "../middleware/auth.middleware.js";


const jobRouter = Router()


jobRouter.post("/add", authorize, requireRoute("LEAD", "USER"), createJob)


export default jobRouter