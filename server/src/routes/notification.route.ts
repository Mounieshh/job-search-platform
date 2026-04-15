import { Router } from "express"
import { authorize } from "../middleware/auth.middleware.js"
import {
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
} from "../controller/notification.controller.js"

const notificationRouter = Router()

notificationRouter.get("/", authorize, getNotifications)
notificationRouter.patch("/read-all", authorize, markAllNotificationsRead)
notificationRouter.patch("/:id/read", authorize, markNotificationRead)

export default notificationRouter
