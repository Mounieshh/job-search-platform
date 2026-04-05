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
            <div className="h-full flex items-center justify-center text-muted-foreground py-20">
                Select a job to review
            </div>
        )
    }

    if (isPending) {
        return (
            <div className="h-full flex justify-center items-center py-20">
                <Spinner className="size-7" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-4 text-muted-foreground">Something went wrong</div>
        )
    }

    return (
        <section key={jobId} className="p-6 flex flex-col space-y-4 h-full overflow-y-auto">

            <div className="space-y-1">
                <h1 className="text-2xl font-bold">{data.roleTitle}</h1>
                <p className="text-muted-foreground">{data.companyName}</p>
                <p className="text-sm text-muted-foreground">
                    {data.location}
                </p>
            </div>

            <Badge className="px-2 py-1">
                {data.employmentType}
            </Badge>

            <div className="flex">
                {data.url && (
                <Link
                    to={data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center cursor-pointer gap-1.5 px-5 py-2.5 text-sm font-medium text-white rounded-[10px] w-fit transition-all duration-100 active:translate-y-0.5"
                    style={{ backgroundColor: '#185FA5', boxShadow: '0 4px 0 #0C447C' }}
                >
                    Apply <ArrowRight className="size-4" />
                </Link>
            )}
            </div>
            

            {data.description && (
                <div
                    className="prose max-w-none border rounded-lg p-5"
                    dangerouslySetInnerHTML={{ __html: data.description }}
                />
            )}
            

            
            <section>
                <h2 className="italic text-lg font-bold text-end">Actions</h2>   
                {data.status === "pending" && (
                    <div className="flex justify-end items-end gap-3 pt-4">
                        <Button
                            onClick={handleApprove}
                            disabled={isReviewing}
                            className="bg-green-600 hover:bg-green-700 text-white gap-2 cursor-pointer"
                        >
                            <Check className="size-4" />
                            {isReviewing ? "Approving..." : "Approve"}
                        </Button>

                        <Button
                            variant="destructive"
                            onClick={() => setShowRejectForm(true)}
                            disabled={isReviewing}
                            className="gap-2 cursor-pointer"
                        >
                            <X className="size-4" /> Reject
                        </Button>
                    </div>
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