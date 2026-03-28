import { Spinner } from "../ui/spinner"
import { Link, useNavigate, useParams } from "react-router"
import { Button } from "../ui/button"
import { useAdminReviewJob } from "@/hooks/mutations/admin"
import { toast } from "sonner"
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog"
import { Textarea } from "../ui/textarea"
import { X, ArrowRight } from "lucide-react"
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
            toast.success("Job approved successfully")
            navigate("/admin/requests")
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
            setShowRejectDialog(false)
            setReason("")
            navigate("/admin/requests")
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    if (!jobId) {
        return (
            <div className="min-h-screen flex items-center justify-center text-muted-foreground">
                Select a job to review
            </div>
        )
    }

    if (isPending) {
        return (
            <div className="min-h-screen flex justify-center items-center">
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
        <section key={jobId} className="p-6 flex flex-col space-y-4 overflow-y-auto h-full">
            <div className="flex flex-row justify-between">
                <div className="flex flex-col space-y-1">
                    <h2 className="font-semibold italic text-lg text-muted-foreground">{data.companyName}</h2>
                    <h1 className="font-bold text-xl">{data.roleTitle}</h1>
                    <h3 className="text-sm text-muted-foreground">{data.location} · {data.employmentType}</h3>
                </div>
                <div>
                    {data.status === "pending" && (
                        <div className="pt-4 flex flex-col gap-4">
                            <p className="font-bold italic">Actions</p>
                            <div className="flex gap-3">
                                <Button
                                    onClick={handleApprove}
                                    disabled={isReviewing}
                                    className="bg-primary hover:bg-primary/80 text-white gap-2 cursor-pointer"
                                >
                                    {isReviewing ? "Approving..." : "Approve"}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowRejectDialog(true)}
                                    disabled={isReviewing}
                                    className="gap-2 cursor-pointer"
                                >
                                    <X className="size-4" /> Reject
                                </Button>
                            </div>
                    </div>
                )}
                </div>
            </div>


            {data.url && (
                <>
                
                    <Link
                        to={data.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-white rounded-[10px] w-fit transition-all duration-100 active:translate-y-0.5"
                        style={{ backgroundColor: '#185FA5', boxShadow: '0 4px 0 #0C447C' }}
                    >
                        Apply <ArrowRight className="size-4" />
                    </Link>

                    <div>
                        Link: <span className="italic ">{data.url}</span>
                    </div>
                </>
                
            )}

            {data.description && (
                <div
                    className="prose max-w-none border rounded-lg p-5"
                    dangerouslySetInnerHTML={{ __html: data.description }}
                />
            )}

                <section className="border-t border-border mt-5 pt-4">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 italic">
                        Who Posted?
                    </h2>
                    
                    {data.user && (
                        <div className="border border-border bg-card p-5 w-full max-w-md rounded-sm">

                            <div className="grid grid-cols-1 gap-3 pb-4 mb-4 border-b border-border/50">
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tight">Full Name</p>
                                    <p className="text-sm font-medium italic">{data.user.name}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tight">Email Address</p>
                                    <p className="text-sm font-medium italic">{data.user.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tight">Account Type</p>
                                    <p className="text-sm font-medium italic capitalize">
                                        {data.user.accountType?.replace("_", " ")}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tight">System Role</p>
                                    <p className="text-sm font-medium italic uppercase text-primary">
                                        {data.user.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </section>


            

            {data.status !== "pending" && (
                <div className={`p-3 rounded-lg border text-sm font-medium ${
                    data.status === "approved"
                        ? "bg-green-50 text-green-800 border-green-200"
                        : "bg-red-50 text-red-800 border-red-200"
                }`}>
                    This job has already been {data.status}
                </div>
            )}

            <Dialog open={showRejectDialog} onOpenChange={(open) => {
                setShowRejectDialog(open)
                if (!open) setReason("")
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reason for Rejection</DialogTitle>
                        <DialogDescription>
                            Specify the reason why you are rejecting this job.
                        </DialogDescription>
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
                                setShowRejectDialog(false)
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
    )
}

export default AdminRequestPreview