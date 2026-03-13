import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { useApproveLeadJob } from "@/hooks/mutations/lead/useApproveLeadJob"
import { useRejectLeadJob } from "@/hooks/mutations/lead/useRejectLeadJob"
import { useLeadJobDetails } from "@/hooks/queries/lead/useLeadJobDetails"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router"

export default function JobDetailLeadPage() {

    const { companyName, slugId } = useParams()

    const { data, isPending, error } = useLeadJobDetails(companyName, slugId)
    const { mutateAsync: approveJob, isPending: isApprovePending } = useApproveLeadJob()
    const { mutateAsync: rejectJob, isPending: isRejectPending } = useRejectLeadJob()
    
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
    const [rejectReason, setRejectReason] = useState("")

    const navigate = useNavigate()

    const actionLoading = isApprovePending || isRejectPending

    
    const handleApprove = async () => {
        if (!data) return
        
        try {
            await approveJob(data.id)

            navigate("/lead-approval")

        } catch (error: any) {
            console.error(error.message || "Failed to Approve Jobs")
        }
    }

    const handleReject = async () => {
        if(!data) return

        const reason = rejectReason.trim()
        if(!reason) return

        try {
            await rejectJob({ jobId: data.id, reason })

            navigate("/lead-approval")
        } catch (error: any) {
            console.error(error.message || "Failed to Reject Job")
        } finally {
            setRejectDialogOpen(false)
            setRejectReason("")
        }
    } 


    if (isPending) {
        return (
        <div className="min-h-screen flex justify-center pt-10">
            <Spinner className="size-7" />
        </div>
        )
    }

    if(error) {
        return (
            <div>
                No Details for the Job
            </div>
        )
    }

    const pendingJob = data.status === "pending"
    const isRejected = data.status === "rejected"
    const backLink = pendingJob ? "/lead-approval" : "/lead/approved-by-me"

  return (
    <>
        <div className="px-3 pt-4 sm:px-6 sm:pt-6">
            <Link to={backLink} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="size-4"/>
                    {pendingJob ? "Back to Pending Jobs" : "Back to Approved / Rejected Jobs"}
            </Link>
        </div>

        <div className="px-3 py-4 sm:px-6 sm:py-6 max-w-6xl mx-auto space-y-6">
                <div className="border border-border bg-card p-6 flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                        {data.companyName}
                        </p>
                        <h1 className="text-2xl font-bold text-card-foreground mt-1">{data.title}</h1>
                        <div className="flex flex-wrap gap-2 mt-3">
                        {data.location && (
                            <span className="text-xs border border-border px-2 py-0.5 text-muted-foreground">
                            {data.location}
                            </span>
                        )}
                        {data.salary && (
                            <span className="text-xs border border-border px-2 py-0.5 text-muted-foreground">
                            {data.salary}
                            </span>
                        )}
                        {data.employmentType && (
                            <span className="text-xs border border-border px-2 py-0.5 text-muted-foreground">
                            {data.employmentType}
                            </span>
                        )}
                        <span className="text-xs border border-border px-2 py-0.5 text-muted-foreground capitalize">
                            {data.source}
                        </span>
                        </div>
                    </div>
                    <Badge
                        variant={pendingJob ? "outline" : isRejected ? "destructive" : "secondary"}
                        className="uppercase font-semibold text-xs"
                    >
                        {data.status}
                    </Badge>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    <div className="flex-1 space-y-4">

                        {isRejected && data.rejectedReason && (
                        <div className="border border-destructive bg-destructive/10 p-4 space-y-1">
                            <p className="text-xs uppercase text-destructive font-semibold tracking-wide">Rejection Reason</p>
                            <p className="text-sm text-destructive">{data.rejectedReason}</p>
                        </div>
                        )}

                        {data.description && (
                        <div className="border border-border bg-card p-5 space-y-2">
                            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Description</p>
                            <p className="text-sm text-card-foreground leading-relaxed whitespace-pre-line">{data.description}</p>
                        </div>
                        )}

                        {data.requirements?.length > 0 && (
                        <div className="border border-border bg-card p-5 space-y-3">
                            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Requirements</p>
                            <ul className="space-y-2">
                            {data.requirements.map((req, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-card-foreground">
                                <span className="mt-2 size-1.5 rounded-full bg-muted-foreground shrink-0" />
                                {req}
                                </li>
                            ))}
                            </ul>
                        </div>
                        )}

                        {data.duties?.length > 0 && (
                        <div className="border border-border bg-card p-5 space-y-3">
                            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Duties</p>
                            <ul className="space-y-2">
                            {data.duties.map((duty, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-card-foreground">
                                <span className="mt-2 size-1.5 rounded-full bg-muted-foreground shrink-0" />
                                {duty}
                                </li>
                            ))}
                            </ul>
                        </div>
                        )}

                        <div className="border border-border bg-card p-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                            <p className="text-xs uppercase text-muted-foreground">Posted On</p>
                            <p className="text-sm text-card-foreground mt-0.5">
                                {new Date(data.createdAt).toLocaleDateString("en-US", {
                                year: "numeric", month: "short", day: "numeric"
                                })}
                            </p>
                            </div>
                        </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-72 space-y-4 shrink-0">

                        <div className="border border-border bg-card p-5 space-y-3">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">data Link</p>
                        {data.url ? (
                            <a
                            href={data.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-1 text-sm font-medium border border-border px-4 py-2 hover:bg-accent transition-colors w-full"
                            >
                            Apply Link <ArrowUpRight className="size-4" />
                            </a>
                        ) : (
                            <p className="text-xs text-muted-foreground">No apply link provided</p>
                        )}
                        </div>

                        <div className="border border-border bg-card p-5 space-y-4">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Posted By</p>
                        {data.user ? (
                            <div className="space-y-3">
                            {[
                                { label: "Name",      value: data.user.name },
                                { label: "Email",     value: data.user.email },
                                { label: "Account Type",    value: data.user.accountType },
                
                            ].map(({ label, value }) => (
                                <div key={label}>
                                <p className="text-xs uppercase text-muted-foreground">{label}</p>
                                <p className="text-sm text-card-foreground mt-0.5 break-all">{value || "—"}</p>
                                </div>
                            ))}
                            <div>
                                <p className="text-xs uppercase text-muted-foreground mb-1">Role</p>
                                <Badge variant="outline" className="rounded-none text-xs">{data.user.role}</Badge>
                            </div>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">User info not available</p>
                        )}
                        </div>

                        {pendingJob && (
                        <div className="border border-border bg-card p-5 space-y-2">
                            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3">Actions</p>
                            <Button
                            type="button"
                            variant="default"
                            className="w-full rounded-none cursor-pointer"
                            onClick={handleApprove}
                            disabled={actionLoading}
                            >
                            {actionLoading ? "Approving..." : "Approve Job"}
                            </Button>
                            <Button
                            type="button"
                            variant="outline"
                            className="w-full rounded-none cursor-pointer"
                            onClick={() => { setRejectReason(""); setRejectDialogOpen(true) }}
                            disabled={actionLoading}
                            >
                            Reject Job
                            </Button>
                        </div>
                        )}
                    </div>
                </div>
        </div>

        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent showCloseButton={false} className="rounded-none">
          <DialogHeader>
            <DialogTitle>Reject Job</DialogTitle>
            <DialogDescription>
              Add a short reason for rejection. This will be saved with the job.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reject-reason">Reason</Label>
            <Textarea
              id="reject-reason"
              placeholder="Write rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="rounded-none"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              className="rounded-none cursor-pointer"
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={!rejectReason.trim() || actionLoading}
              onClick={handleReject}
              className="rounded-none cursor-pointer"
            >
              {actionLoading ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
