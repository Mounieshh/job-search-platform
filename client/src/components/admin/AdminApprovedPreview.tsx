import { useAdminSingleJob } from "@/hooks/queries/admin"
import { useGetJobApprovalInfo } from "@/hooks/queries/lead"
import { Spinner } from "../ui/spinner"
import { Link, useParams } from "react-router"
import { ArrowRight } from "lucide-react"
import StatusBadge from "../shared/StatusBadge"
import { Button } from "../ui/button"

const AdminApprovedPreview = () => {
    const { jobId } = useParams()
    const { data, isPending, error } = useAdminSingleJob(jobId)
    const { data: approvalInfo } = useGetJobApprovalInfo(jobId)

    if (!jobId) return (
        <div className="flex items-center justify-center h-full py-20 text-sm text-muted-foreground">
            Select a job to view details
        </div>
    )

    if (isPending) return (
        <div className="flex justify-center items-center py-20">
            <Spinner className="size-6 text-muted-foreground" />
        </div>
    )

    if (error) return (
        <div className="p-4 text-sm text-muted-foreground">Something went wrong.</div>
    )

    return (
        <article key={jobId} className="p-6 space-y-6">
            {/* Job header */}
            <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{data.companyName}</p>
                <h1 className="text-xl font-semibold tracking-tight text-foreground">{data.roleTitle}</h1>
                <p className="text-sm text-muted-foreground">{data.location} · {data.employmentType}</p>
            </div>

            {/* External link */}
            {data.url && (
                <Button asChild size="sm" className="gap-1.5">
                    <Link to={data.url} target="_blank" rel="noopener noreferrer">
                        View posting <ArrowRight aria-hidden="true" className="size-3.5" />
                    </Link>
                </Button>
            )}

            {/* Approval info */}
            {approvalInfo && (
                <div className="rounded-md border border-border bg-card p-4 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                                {approvalInfo.action === "approved" ? "Approved" : "Rejected"} by
                            </p>
                            <p className="text-sm font-medium text-foreground">
                                {approvalInfo.leadName}
                                <span className="text-muted-foreground font-normal"> · {data.companyName}</span>
                            </p>
                        </div>
                        <StatusBadge status={approvalInfo.action} />
                    </div>
                    {approvalInfo.reason && (
                        <p className="text-xs text-muted-foreground border-t border-border pt-3">
                            Reason: {approvalInfo.reason}
                        </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                        {new Date(approvalInfo.createdAt).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                        })}
                    </p>
                </div>
            )}

            <hr className="border-border" />

            {/* Description */}
            {data.description && (
                <div
                    className="prose prose-sm max-w-none border border-border rounded-lg p-5 text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: data.description }}
                />
            )}

            {/* Posted by */}
            <div className="border-t border-border pt-5">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                    Posted by
                </p>
                {data.user ? (
                    <div>
                        <p className="text-sm font-medium text-foreground">{data.user.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{data.user.email}</p>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">Unknown user</p>
                )}
            </div>
        </article>
    )
}

export default AdminApprovedPreview
