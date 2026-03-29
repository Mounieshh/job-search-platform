import { Router } from "express";
import { authorize, requireRoute } from "../middleware/auth.middleware.js";
import {
    getCompanyList,
    getCompanyUsersList,
    getAdminCompanyDirectory,
} from "../controller/company.controller.js";


const companyRouter = Router()

companyRouter.get("/list", authorize, requireRoute("ADMIN"), getCompanyList)
companyRouter.get("/admin/directory", authorize, requireRoute("ADMIN"), getAdminCompanyDirectory)
companyRouter.get("/:companyId/users", authorize, requireRoute("ADMIN"), getCompanyUsersList)

export default companyRouter