
import { useLeadPostedApplications } from "@/hooks/queries/lead"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router"
import { ArrowRight } from "lucide-react"


export default function JobsPosted() {
    const { data, isPending, error } = useLeadPostedApplications()

    if (isPending) {
        return (
            <div className="min-h-screen flex justify-center pt-10">
                <Spinner className="size-7" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-4 text-muted-foreground">
                Unable to fetch your posted jobs and applications
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Applications</h1>

            {!data || data.length === 0 ? (
                <p className="text-muted-foreground">You have not posted any jobs yet.</p>
            ) : (
                data.map((job) => (
                    <Card key={job.id} className="gap-3">
                        <CardHeader className="pb-1">
                            <CardTitle className="flex items-center justify-between gap-4">
                                <span>{job.roleTitle}</span>
                                <Badge className="uppercase">{job.applicationsCount} Applications</Badge>
                            </CardTitle>
                            <CardDescription>{job.companyName} | {job.location} | {job.employmentType}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <Link
                                to={`/lead/posted/${job.id}/applications`}
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                            >
                                Manage Applications
                                <ArrowRight className="size-4" />
                            </Link>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    )
}