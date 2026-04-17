import { Spinner } from "../ui/spinner"
import { Link, useNavigate, useParams } from "react-router"
import { Button } from "../ui/button"
import { useAdminReviewJob } from "@/hooks/mutations/admin"
import { toast } from "sonner"
import { useState } from "react"
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
} from "../ui/dialog"
import { Textarea } from "../ui/textarea"
import { X, ArrowRight, Check } from "lucide-react"
import { useAdminSingleJob } from "@/hooks/queries/admin"

const AdminRequestPreview = () => {
    const { mutateAsync: reviewJob, isPending: isReviewing } = useAdminReviewJob()
    const { jobId } = useParams()
    const navigate = useNavigate()
    const { data, isPending, error } = useAdminSingleJob(jobId)

    const [showRejectDialog, setShowRejectDialog] = useState(false)
    const [reason, setReason] = useState("")

    const handleApprove = async () => {
        if (!jobId) return
        try {
            await reviewJob({ jobId, action: "approved" })
            toast.success("Job approved")
            navigate("/admin/requests")
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const handleReject = async () => {
        if (!jobId) return
        if (!reason.trim()) { toast.error("Please provide a reason for rejection"); return }
        try {
            await reviewJob({ jobId, action: "rejected", reason })
            toast.success("Job rejected")
            setShowRejectDialog(false)
            setReason("")
            navigate("/admin/requests")
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    if (!jobId) return (
        <div className="flex items-center justify-center h-full py-20 text-sm text-muted-foreground">
            Select a job to review
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
        <section key={jobId} className="p-6 flex flex-col space-y-5 overflow-y-auto h-full">
            {/* Back link on mobile */}
            <Link to="/admin/requests" className="lg:hidden text-sm text-primary inline-flex items-center">
                ← Back to queue
            </Link>

            {/* Header */}
            <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">{data.companyName}</p>
                <h1 className="text-xl font-semibold tracking-tight text-foreground">{data.roleTitle}</h1>
                <p className="text-sm text-muted-foreground">{data.location} · {data.employmentType}</p>
            </div>

            {/* Actions */}
            {data.status === "pending" && (
                <div className="flex gap-3">
                    <Button
                        onClick={handleApprove}
                        disabled={isReviewing}
                        className="gap-1.5"
                    >
                        <Check aria-hidden="true" className="size-4" />
                        {isReviewing ? "Approving…" : "Approve"}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setShowRejectDialog(true)}
                        disabled={isReviewing}
                        className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
                    >
                        <X aria-hidden="true" className="size-4" /> Reject
                    </Button>
                </div>
            )}

            {data.status !== "pending" && (
                <div className={`rounded-md border px-4 py-3 text-sm font-medium ${
                    data.status === "approved"
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-destructive/10 text-destructive border-destructive/20"
                }`}>
                    This job has already been {data.status}.
                </div>
            )}

            {/* External link */}
            {data.url && (
                <div className="flex items-center gap-3">
                    <Link
                        to={data.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline underline-offset-4"
                    >
                        View original posting <ArrowRight aria-hidden="true" className="size-3.5" />
                    </Link>
                    <span className="text-xs text-muted-foreground truncate max-w-xs">{data.url}</span>
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

            {/* Poster info */}
            {data.user && (
                <section>
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                        Posted by
                    </h2>
                    <div className="border border-border bg-card rounded-md p-4 space-y-3 text-sm max-w-sm">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Name</span>
                            <span className="font-medium text-foreground">{data.user.name}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Email</span>
                            <span className="text-foreground">{data.user.email}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider">Verified</span>
                                <span className={`font-medium ${data.user.isEmailVerified ? "text-primary" : "text-destructive"}`}>
                                    {data.user.isEmailVerified ? "Verified" : "Not verified"}
                                </span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider">Role</span>
                                <span className="font-medium text-foreground uppercase">{data.user.role}</span>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Reject dialog */}
            <Dialog open={showRejectDialog} onOpenChange={open => { setShowRejectDialog(open); if (!open) setReason("") }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reason for rejection</DialogTitle>
                        <DialogDescription>
                            Explain why this job is being rejected.
                        </DialogDescription>
                    </DialogHeader>
                    <Textarea
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                        placeholder="Explain why this job is being rejected…"
                        aria-label="Rejection reason"
                        className="min-h-28"
                    />
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => { setShowRejectDialog(false); setReason("") }} disabled={isReviewing}>
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
    )
}

export default AdminRequestPreview
