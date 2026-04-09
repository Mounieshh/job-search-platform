import StatusBadge from "@/components/shared/StatusBadge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { useMyTrackedApplications } from "@/hooks/queries/profile"

export default function TrackApplicationsPage() {
    const { data, isPending, error } = useMyTrackedApplications()

    if (isPending) {
        return (
            <div className="min-h-50 flex items-center justify-center">
                <Spinner className="size-7" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-50 flex items-center justify-center">
                <p className="text-muted-foreground">Unable to load tracked applications</p>
            </div>
        )
    }

    if (!data || data.length === 0) {
        return (
            <div className="min-h-50 flex items-center justify-center">
                <p className="text-muted-foreground">You have not applied to any jobs yet.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4 max-w-5xl mx-auto">
            <div className="border-b pb-4">
                <h1 className="text-xl font-semibold tracking-tight">My Applications</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    {data.length} application{data.length !== 1 ? "s" : ""} submitted
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((application) => (
                    <Card key={application.id} className="gap-0 overflow-hidden">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base leading-snug">
                                {application.job?.roleTitle || "Job unavailable"}
                            </CardTitle>
                            <CardDescription>{application.job?.companyName || "Unknown company"}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-xs text-muted-foreground">
                                {application.job?.location || "N/A"} &middot; {application.job?.employmentType || "N/A"}
                            </p>
                            <div className="flex items-center justify-between">
                                <StatusBadge status={application.status} />
                                <p className="text-xs text-muted-foreground">
                                    {new Date(application.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                </p>
                            </div>
                            {application.status === "rejected" && application.rejectionReason && (
                                <div className="rounded-md bg-red-50 border border-red-100 px-3 py-2">
                                    <p className="text-xs font-medium text-red-700 mb-0.5">Feedback</p>
                                    <p className="text-xs text-red-600 leading-relaxed">{application.rejectionReason}</p>
                                </div>
                            )}
                            {application.status === "shortlisted" && (
                                <div className="rounded-md bg-blue-50 border border-blue-100 px-3 py-2">
                                    <p className="text-xs text-blue-700 leading-relaxed">
                                        You've been shortlisted. The team will reach out soon.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
