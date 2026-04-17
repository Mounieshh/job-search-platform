import { useGetSingleJob } from "@/hooks/queries/postjob"
import { useReviewJob } from "@/hooks/mutations/lead"
import { Spinner } from "../ui/spinner"
import { Link, useParams, useNavigate } from "react-router"
import { ArrowRight, Check, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import StatusBadge from "../shared/StatusBadge"

const LeadApprovalPreview = () => {
    const { jobId } = useParams()
    const navigate = useNavigate()
    const { data, isPending, error } = useGetSingleJob(jobId)
    const { mutateAsync: reviewJob, isPending: isReviewing } = useReviewJob()

    const [showRejectForm, setShowRejectForm] = useState(false)
    const [reason, setReason] = useState("")

    const handleApprove = async () => {
        if (!jobId) return
        try {
            await reviewJob({ jobId, action: "approved" })
            toast.success("Job approved successfully")
            navigate("/lead-approval")
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const handleReject = async () => {
        if (!jobId) return
        if (!reason.trim()) {
            toast.error("Please provide a reason for rejection")
            return
        }
        try {
            await reviewJob({ jobId, action: "rejected", reason })
            toast.success("Job rejected")
            navigate("/lead-approval")
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    if (!jobId) {
        return (
            <div className="flex justify-center items-center h-full py-20 text-sm text-muted-foreground">
                Select a job from the queue to review
            </div>
        )
    }

    if (isPending) {
        return (
            <div className="flex justify-center items-center py-20">
                <Spinner className="size-6 text-muted-foreground" />
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="p-4 text-sm text-muted-foreground">Something went wrong</div>
        )
    }

    return (
        <section key={jobId} className="p-6 flex flex-col space-y-6 h-full overflow-y-auto">
            <Link to="/lead-approval" className="lg:hidden text-sm text-primary inline-flex items-center">
                ← Back to queue
            </Link>

            <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">{data.roleTitle}</h1>
                <p className="text-base text-muted-foreground">{data.companyName}</p>
                {data.postedUser?.name && (
                    <p className="text-xs text-muted-foreground/70 mt-2">
                        Submitted by {data.postedUser.name}
                    </p>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    {data.location}
                </span>
                <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    {data.employmentType}
                </span>
                {data.url && (
                    <Link
                        to={data.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1 ml-2"
                    >
                        View posting <ArrowRight aria-hidden="true" className="size-3" />
                    </Link>
                )}
            </div>

            <hr className="border-border" />

            {data.description && (
                <div
                    className="prose prose-sm max-w-none border border-border rounded-lg p-5 text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: data.description }}
                />
            )}

            <hr className="border-border" />

            <section className="flex flex-col pb-8 gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Actions</h2>
                    {data.status !== "pending" && <StatusBadge status={data.status} />}
                </div>
                {data.status === "pending" && (
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setShowRejectForm(true)}
                            disabled={isReviewing}
                            className="border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive shadow-none"
                        >
                            <X aria-hidden="true" className="size-4 mr-1.5" /> Reject
                        </Button>
                        <Button
                            onClick={handleApprove}
                            disabled={isReviewing}
                            className="shadow-none"
                        >
                            <Check aria-hidden="true" className="size-4 mr-1.5" />
                            {isReviewing ? "Approving…" : "Approve"}
                        </Button>
                    </div>
                )}

                <Dialog open={showRejectForm} onOpenChange={(open) => {
                    setShowRejectForm(open)
                    if (!open) setReason("")
                }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Reason for rejection</DialogTitle>
                        </DialogHeader>
                        <Textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Explain why this job is being rejected…"
                            className="min-h-30"
                        />
                        <DialogFooter className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowRejectForm(false)
                                    setReason("")
                                }}
                                disabled={isReviewing}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleReject}
                                disabled={isReviewing || !reason.trim()}
                            >
                                {isReviewing ? "Rejecting…" : "Confirm reject"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </section>
        </section>
    )
}

export default LeadApprovalPreview
