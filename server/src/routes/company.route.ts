import { Router } from "express";
import { authorize, requireRoute } from "../middleware/auth.middleware.js";
import { getCompanyList } from "../controller/company.controller.js";


const companyRouter = Router()

companyRouter.get("/list", authorize, requireRoute("ADMIN"), getCompanyList)

export default companyRouter