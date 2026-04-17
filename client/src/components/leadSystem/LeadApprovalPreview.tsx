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
import { Badge } from "../ui/badge"

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
            <div className="flex justify-center items-center h-full py-20 text-sm text-gray-500">
                Select a job from the queue to review
            </div>
        )
    }

    if (isPending) {
        return (
            <div className="flex justify-center items-center py-20">
                <Spinner className="size-6 text-gray-400" />
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="p-4 text-sm text-gray-500">Something went wrong</div>
        )
    }

    return (
        <section key={jobId} className="p-6 flex flex-col space-y-6 h-full overflow-y-auto">
            <Link to="/lead-approval" className="lg:hidden text-sm text-primary inline-flex items-center">
                ← Back to queue
            </Link>

            <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">{data.roleTitle}</h1>
                <p className="text-base text-gray-500">{data.companyName}</p>
                {data.postedUser?.name && (
                    <p className="text-xs text-gray-400 mt-2">
                        Submitted by {data.postedUser.name}
                    </p>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100 font-normal">
                    {data.location}
                </Badge>
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100 font-normal">
                    {data.employmentType}
                </Badge>
                {data.url && (
                    <Link
                        to={data.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1 ml-2"
                    >
                        View posting <ArrowRight className="size-3" />
                    </Link>
                )}
            </div>

            <hr className="border-gray-200" />

            {data.description && (
                <div
                    className="prose prose-sm max-w-none border border-gray-200 rounded-lg p-5 text-gray-600"
                    dangerouslySetInnerHTML={{ __html: data.description }}
                />
            )}
            
            <hr className="border-gray-200" />
            
            <section className="flex flex-col items-end pb-8">
                <h2 className="text-xs font-semibold uppercase text-muted-foreground mb-4 tracking-wider">Actions</h2>   
                {data.status === "pending" ? (
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setShowRejectForm(true)}
                            disabled={isReviewing}
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 shadow-none"
                        >
                            <X className="size-4 mr-1.5" /> Reject
                        </Button>
                        <Button
                            onClick={handleApprove}
                            disabled={isReviewing}
                            className="bg-primary text-white shadow-none"
                        >
                            <Check className="size-4 mr-1.5" />
                            {isReviewing ? "Approving..." : "Approve"}
                        </Button>
                    </div>
                ) : (
                    <Badge className={`rounded-full px-3 py-1 font-medium text-xs ${
                        data.status === "approved" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                        data.status === "rejected" ? "bg-red-100 text-red-800 hover:bg-red-100" :
                        data.status === "shortlisted" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" :
                        "bg-gray-100 text-gray-800 hover:bg-gray-100"
                    }`}>
                        {data.status.toUpperCase()}
                    </Badge>
                )}
                
                <Dialog open={showRejectForm} onOpenChange={(open) => {
                    setShowRejectForm(open)
                    if (!open) setReason("")
                }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Reason for Rejection</DialogTitle>
                        </DialogHeader>

                        <Textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Explain why this job is being rejected..."
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
                                className="gap-2"
                            >
                                {isReviewing ? "Rejecting..." : "Confirm Reject"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </section>
        </section>
    )
}

export default LeadApprovalPreview