import { Request, Response } from "express"
import { Notification } from "../models/notification.schema.js"

export async function getNotifications(req: Request, res: Response) {
    try {
        const user = (req as any).user

        const notifications = await Notification.find({ userId: String(user._id) })
            .sort({ createdAt: -1 })
            .limit(50)
            .lean()

        const unreadCount = notifications.filter((n) => !n.isRead).length

        return res.status(200).json({ notifications, unreadCount })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
}

export async function markNotificationRead(req: Request, res: Response) {
    try {
        const user = (req as any).user
        const { id } = req.params

        await Notification.updateOne(
            { _id: id, userId: String(user._id) },
            { isRead: true }
        )

        return res.status(200).json({ message: "Marked as read" })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
}

export async function markAllNotificationsRead(req: Request, res: Response) {
    try {
        const user = (req as any).user

        await Notification.updateMany(
            { userId: String(user._id), isRead: false },
            { isRead: true }
        )

        return res.status(200).json({ message: "All notifications marked as read" })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
}
