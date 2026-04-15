import { Bell, CheckCheck, CheckCircle2, XCircle, Info } from "lucide-react"
import { Link } from "react-router"
import { useNotifications } from "@/hooks/queries/notifications"
import { useMarkAllRead, useMarkNotificationRead } from "@/hooks/mutations/notifications"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { AppNotification } from "@/api/notifications"

function NotificationIcon({ type }: { type: AppNotification["type"] }) {
    if (type === "shortlisted")
        return <CheckCircle2 className="size-4 shrink-0 text-green-500" />
    if (type === "rejected")
        return <XCircle className="size-4 shrink-0 text-red-500" />
    return <Info className="size-4 shrink-0 text-blue-500" />
}

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "just now"
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
}

export default function NotificationBell() {
    const { data } = useNotifications()
    const { mutate: markRead } = useMarkNotificationRead()
    const { mutate: markAll, isPending: isMarkingAll } = useMarkAllRead()

    const notifications = data?.notifications ?? []
    const unreadCount = data?.unreadCount ?? 0

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="relative flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent transition-colors">
                    <Bell className="size-4 text-foreground/80" />
                    {unreadCount > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-80 p-0 bg-background border border-border shadow-xl"
                sideOffset={8}
            >
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <p className="text-sm font-semibold">Notifications</p>
                    {unreadCount > 0 && (
                        <button
                            onClick={() => markAll()}
                            disabled={isMarkingAll}
                            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <CheckCheck className="size-3.5" />
                            Mark all read
                        </button>
                    )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-border">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <Bell className="size-8 text-muted-foreground/30 mb-2" />
                            <p className="text-sm text-muted-foreground">No notifications yet</p>
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <button
                                key={n.id}
                                onClick={() => { if (!n.isRead) markRead(n.id) }}
                                className={`w-full text-left px-4 py-3 flex gap-3 items-start transition-colors hover:bg-muted/50 ${!n.isRead ? "bg-blue-50/60 dark:bg-blue-950/20" : ""}`}
                            >
                                <NotificationIcon type={n.type} />
                                <div className="min-w-0 flex-1">
                                    <p className={`text-sm leading-snug ${!n.isRead ? "font-medium text-foreground" : "text-foreground/80"}`}>
                                        {n.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                                        {n.message}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground/60 mt-1">{timeAgo(n.createdAt)}</p>
                                </div>
                                {!n.isRead && (
                                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                                )}
                            </button>
                        ))
                    )}
                </div>

                <div className="border-t border-border px-4 py-2.5">
                    <Link
                        to="/notifications"
                        className="text-xs text-primary hover:underline"
                    >
                        View all notifications
                    </Link>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
