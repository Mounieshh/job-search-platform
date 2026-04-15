import { CheckCheck, CheckCircle2, XCircle, Info, Bell } from "lucide-react"
import { useNotifications } from "@/hooks/queries/notifications"
import { useMarkAllRead, useMarkNotificationRead } from "@/hooks/mutations/notifications"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import type { AppNotification } from "@/api/notifications"

function NotificationIcon({ type }: { type: AppNotification["type"] }) {
    if (type === "shortlisted")
        return (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="size-5 text-green-600" />
            </div>
        )
    if (type === "rejected")
        return (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">
                <XCircle className="size-5 text-red-500" />
            </div>
        )
    return (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100">
            <Info className="size-5 text-blue-500" />
        </div>
    )
}

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "just now"
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default function NotificationsPage() {
    const { data, isPending } = useNotifications()
    const { mutate: markRead } = useMarkNotificationRead()
    const { mutate: markAll, isPending: isMarkingAll } = useMarkAllRead()

    const notifications = data?.notifications ?? []
    const unreadCount = data?.unreadCount ?? 0

    if (isPending) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Spinner className="size-7" />
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">Notifications</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 rounded-none"
                        disabled={isMarkingAll}
                        onClick={() => markAll()}
                    >
                        <CheckCheck className="size-3.5" />
                        Mark all read
                    </Button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Bell className="size-12 text-muted-foreground/20 mb-3" />
                    <p className="font-medium text-muted-foreground">No notifications yet</p>
                    <p className="text-sm text-muted-foreground/60 mt-1">
                        You'll be notified when your application status changes.
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-border border border-border rounded-none overflow-hidden">
                    {notifications.map((n) => (
                        <div
                            key={n.id}
                            onClick={() => { if (!n.isRead) markRead(n.id) }}
                            className={`flex gap-4 px-4 py-4 cursor-pointer transition-colors hover:bg-muted/40 ${!n.isRead ? "bg-blue-50/50 dark:bg-blue-950/10" : ""}`}
                        >
                            <NotificationIcon type={n.type} />
                            <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                    <p className={["text-sm leading-snug", !n.isRead ? "font-semibold text-foreground" : "font-medium text-foreground/80"].join(" ")}>
                                        {n.title}
                                    </p>
                                    <span className="shrink-0 text-xs text-muted-foreground/60 whitespace-nowrap">
                                        {timeAgo(n.createdAt)}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                    {n.message}
                                </p>
                                {n.meta?.jobTitle && (
                                    <p className="text-xs text-muted-foreground/60 mt-1.5">
                                        {n.meta.companyName ? `${n.meta.companyName} · ` : ""}{n.meta.jobTitle}
                                    </p>
                                )}
                            </div>
                            {!n.isRead && (
                                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
