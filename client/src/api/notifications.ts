import { baseUrl } from "@/lib/base"

export type AppNotification = {
    id: string
    type: "shortlisted" | "rejected" | "application_received" | "general"
    title: string
    message: string
    isRead: boolean
    createdAt: string
    meta?: {
        jobId?: string
        applicationId?: string
        jobTitle?: string
        companyName?: string
    }
}

type NotificationsResponse = {
    notifications: AppNotification[]
    unreadCount: number
}

export async function fetchNotifications(): Promise<NotificationsResponse> {
    const response = await fetch(`${baseUrl}/api/notifications`, {
        method: "GET",
        credentials: "include",
    })

    if (!response.ok) throw new Error("Failed to fetch notifications")
    const data = await response.json()

    const notifications = (data.notifications ?? []).map((n: any) => ({
        ...n,
        id: n._id ?? n.id,
    }))

    return {
        notifications,
        unreadCount: data.unreadCount ?? 0,
    }
}

export async function markNotificationRead(notificationId: string): Promise<void> {
    const response = await fetch(`${baseUrl}/api/notifications/${notificationId}/read`, {
        method: "PATCH",
        credentials: "include",
    })
    if (!response.ok) throw new Error("Failed to mark notification as read")
}

export async function markAllNotificationsRead(): Promise<void> {
    const response = await fetch(`${baseUrl}/api/notifications/read-all`, {
        method: "PATCH",
        credentials: "include",
    })
    if (!response.ok) throw new Error("Failed to mark all notifications as read")
}
