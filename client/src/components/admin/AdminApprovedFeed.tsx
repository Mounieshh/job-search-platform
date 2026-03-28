import { useAdminReviewedJobs } from "@/hooks/queries/admin"
import { Spinner } from "../ui/spinner"
import { Badge } from "@/components/ui/badge"
import { Inbox } from "lucide-react"
import { Link, useParams } from "react-router"

const AdminApprovedFeed = () => {
    const { data, isPending, error } = useAdminReviewedJobs()
    const { jobId } = useParams()

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner className="size-7" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-4 border border-destructive/20 bg-destructive/5 text-destructive text-xs rounded-sm">
                Error loading reviewed jobs.
            </div>
        )
    }

    return (
        <section className="h-screen overflow-y-auto border-r border-border p-4 space-y-4">
            <header className="flex justify-between items-center mb-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">History</h2>
                <Badge variant="secondary" className="text-[10px]">{data.length}</Badge>
            </header>

            {data.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center opacity-50">
                    <Inbox className="size-8 mb-2" />
                    <p className="text-xs">No records found</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {data.map((job: any) => (
                        <Link
                            to={`/admin/reviewed/${job.id}`}
                            key={job.id}
                            className={`block p-3 border rounded-sm transition-all ${
                                jobId === job.id
                                    ? "bg-card border-primary/50 shadow-sm"
                                    : "bg-transparent border-transparent hover:border-border hover:bg-card/50"
                            }`}
                        >
                            <div className="flex justify-between items-start gap-2">
                                <div className="min-w-0">
                                    <h3 className="text-sm font-semibold truncate">{job.companyName}</h3>
                                    <p className="text-xs text-muted-foreground truncate">{job.roleTitle}</p>
                                </div>
                                <Badge
                                    className={`text-[9px] h-4 px-1 uppercase italic shrink-0 ${job.status === "approved" ? "bg-green-700   ": "bg-destructive"}`}
                                >
                                    {job.status}
                                </Badge>
                            </div>
                            {job.approval && (
                                <p className="text-[10px] text-muted-foreground mt-1">
                                    by {job.approval.leadName}
                                </p>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </section>
    )
}

export default AdminApprovedFeed