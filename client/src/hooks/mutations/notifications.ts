import { markAllNotificationsRead, markNotificationRead } from "@/api/notifications"
import { NOTIFICATIONS_KEY } from "@/hooks/queries/notifications"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useMarkNotificationRead() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (notificationId: string) => markNotificationRead(notificationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY })
        },
    })
}

export function useMarkAllRead() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: markAllNotificationsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY })
        },
    })
}
