import { fetchNotifications } from "@/api/notifications"
import { useQuery } from "@tanstack/react-query"

export const NOTIFICATIONS_KEY = ["notifications"] as const

export function useNotifications() {
    return useQuery({
        queryKey: NOTIFICATIONS_KEY,
        queryFn: fetchNotifications,
        refetchInterval: 30_000, // poll every 30s
        retry: false,
    })
}
