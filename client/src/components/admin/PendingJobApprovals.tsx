import { useState } from "react"
import { Spinner } from "../ui/spinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import { Link } from "react-router"
import { useAdminApprove, useAdminReject } from "@/hooks/mutations/job"
import { usePendingJobs } from "@/hooks/queries/job"


const PendingJobApprovalCard = () => {
    const { data: pendingJobs = [], isPending} = usePendingJobs()

    const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
    const [rejectReason, setRejectReason] = useState("")

    const approveMutation = useAdminApprove()
    const rejectMutation = useAdminReject()

    


    const handleApprove = async (jobId: string) => {
        if(approveMutation.isPending){
            return
        }

        await approveMutation.mutateAsync(jobId)
    }

    const handleReject = async (jobId: string) => {
         const reason = rejectReason.trim()

         if(!reason){
            return
         }

            await rejectMutation.mutateAsync({ jobId, reason })
            setRejectDialogOpen(false)
            setRejectReason("")
            setSelectedJobId(null)
    }

    const openRejectDialog = (jobId: string) => {
        setSelectedJobId(jobId)
        setRejectReason("")
        setRejectDialogOpen(true)
    }
    
    if(isPending){
        return (
            <div className="min-h-screen flex justify-center pt-10">
                <Spinner className="size-7"/>
            </div>
        )
    }

    function toSlug(title: string): string {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
    }

  return (
    <div className="px-3 py-4 sm:px-6 sm:py-6">
            <div className="border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <div>
                        <h2 className="text-base font-semibold text-card-foreground">Pending Job Approvals</h2>
                        <p className="text-sm text-muted-foreground">Review and approve submitted jobs</p>
                    </div>
                    <Badge variant="secondary" className="rounded-none">{pendingJobs.length}</Badge>
                </div>

            <Table className="w-full min-w-245">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Sno</TableHead>
                            <TableHead>Job Title</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>PostedBy</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Job Details</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                    {pendingJobs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="py-8 text-center text-sm text-muted-foreground">
                                    No pending jobs to review
                                </TableCell>
                            </TableRow>
                    ) : pendingJobs.map((pending, index) => (
                            <TableRow key={pending.id}>
                                <TableCell>
                                    {String(index + 1).padStart(2, "0")}
                                </TableCell>
                                <TableCell className="font-medium text-card-foreground">{pending.title}</TableCell>
                                <TableCell className="text-muted-foreground">{pending.companyName}</TableCell>
                                <TableCell className="text-muted-foreground">{pending.user?.email || "N/A"}</TableCell>
                                <TableCell className="text-muted-foreground">{pending.user?.role || "N/A"}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="rounded-none bg-gray-800 text-white uppercase font-semibold">{pending.status}</Badge>
                                </TableCell>
                                <TableCell>
                                    <Link to={`/admin/jobs/${encodeURIComponent(pending.companyName || "company")}/${encodeURIComponent(toSlug(pending.title))}`}>
                                        <Button className="rounded-none cursor-pointer" variant="outline">
                                            View Details
                                        </Button>
                                    </Link>
                                </TableCell>
                                <TableCell className="flex flex-row gap-1 whitespace-nowrap">
                                    <Button type="button" variant="outline" size="sm" className="cursor-pointer rounded-none w-20" onClick={() => handleApprove(pending.id)}>
                                        {approveMutation.isPending ? "Approving..." : "Approve"}
                                    </Button>
                                    <Button type="button" variant="outline" size="sm" className="cursor-pointer rounded-none w-20" onClick={() => openRejectDialog(pending.id)}>
                                        Reject
                                    </Button>
                                </TableCell>
                                
                            </TableRow>
                    ))}
                    </TableBody>
            </Table>
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
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            disabled={!rejectReason.trim() || rejectMutation.isPending || !selectedJobId}
                            onClick={() => selectedJobId && handleReject(selectedJobId)}
                            className="rounded-none cursor-pointer"
                        >
                            {rejectMutation.isPending ? "Rejecting..." : "Reject"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
    </div>
  )
}

export default PendingJobApprovalCard