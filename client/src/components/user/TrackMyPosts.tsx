import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { useGetpostJobs } from "@/hooks/queries/postjob"
import StatusBadge from "../shared/StatusBadge"

export default function TrackMyPosts() {
    const { data, isPending, error } = useGetpostJobs()

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
                <p className="text-muted-foreground">Something went wrong</p>
            </div>
        )
    }

    return (
        <div className="p-6">
            {data.jobs.length === 0 ? (
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-muted-foreground">No jobs found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.jobs.map((job) => (
                        <Card key={job.id} className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader>
                                <CardTitle>{job.roleTitle}</CardTitle>
                                <CardDescription>{job.companyName}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2 flex flex-row justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">{job.location}</p>
                                    <p className="text-sm text-muted-foreground">{job.employmentType}</p>
                                </div>
                                <div>
                                    <StatusBadge status={job.status}/>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}