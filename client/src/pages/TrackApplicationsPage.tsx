import StatusBadge from "@/components/shared/StatusBadge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { useMyTrackedApplications } from "@/hooks/queries/profile"

export default function TrackApplicationsPage() {
    const { data, isPending, error } = useMyTrackedApplications()

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner className="size-7" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Unable to load tracked applications</p>
            </div>
        )
    }

    if (!data || data.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">You have not applied to any jobs yet.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="rounded-xl border bg-card p-4 sm:p-5">
                <h1 className="text-2xl font-bold">Track Applications</h1>
                <p className="text-sm text-muted-foreground mt-1">View your submitted applications and current response status.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((application) => (
                    <Card key={application.id} className="gap-2">
                        <CardHeader>
                            <CardTitle>{application.job?.roleTitle || "Job unavailable"}</CardTitle>
                            <CardDescription>{application.job?.companyName || "Unknown company"}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-sm text-muted-foreground">
                                {application.job?.location || "N/A"} | {application.job?.employmentType || "N/A"}
                            </p>
                            <div className="flex items-center justify-between">
                                <StatusBadge status={application.status} />
                                <p className="text-xs text-muted-foreground">Applied on {new Date(application.createdAt).toLocaleDateString()}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
