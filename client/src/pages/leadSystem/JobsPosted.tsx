import { useLeadPostedApplications } from "@/hooks/queries/lead"
import { useCloseJobApplications } from "@/hooks/mutations/lead"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "react-router"
import { ArrowRight, XCircle } from "lucide-react"
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export default function JobsPosted() {
    const { data, isPending, error } = useLeadPostedApplications()
    const { mutate: closeJob, isPending: isClosing } = useCloseJobApplications()
    const [confirmCloseId, setConfirmCloseId] = useState<string | null>(null)

    if (isPending) {
        return (
            <div className="min-h-50 flex justify-center items-center">
                <Spinner className="size-6 text-gray-400" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-4 text-sm text-gray-500 text-center py-10">
                Unable to fetch your posted jobs and applications
            </div>
        )
    }

    return (
        <div className="space-y-4 max-w-4xl mx-auto p-4 sm:p-6">
            <h1 className="text-xl font-semibold tracking-tight">Your posted jobs</h1>

            {!data || data.length === 0 ? (
                <p className="text-sm text-gray-500 py-20 text-center">You have not posted any jobs yet.</p>
            ) : (
                <div className="flex flex-col">
                    {data.map((job) => {
                        const isClosed = job.status === "application_closed"
                        return (
                        <div key={job.id} className="flex justify-between items-center py-4 border-b border-gray-100 gap-4">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <p className="text-sm font-medium text-gray-900">{job.roleTitle}</p>
                                    {isClosed && (
                                        <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-100 rounded-full font-medium text-[10px] uppercase shadow-none border-none">
                                            Closed
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                    {job.companyName} &middot; {job.location} &middot; {job.employmentType}
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-3 shrink-0">
                                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 rounded-full font-medium text-[10px] uppercase shadow-none border-none">
                                    {job.applicationsCount} Applications
                                </Badge>
                                <Link
                                    to={`/lead/posted/${job.id}/applications`}
                                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline transition-colors"
                                >
                                    Manage <ArrowRight className="size-3" />
                                </Link>
                                {!isClosed && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-xs border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 shadow-none rounded-none gap-1"
                                        onClick={() => setConfirmCloseId(job.id)}
                                    >
                                        <XCircle className="size-3" />
                                        Close
                                    </Button>
                                )}
                            </div>
                        </div>
                        )
                    })}
                </div>
            )}

            <Dialog open={!!confirmCloseId} onOpenChange={(open) => { if (!open) setConfirmCloseId(null) }}>
                <DialogContent className="rounded-none max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Close applications?</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        This will stop accepting new applications and remove the job from the browse listings. Existing applications are not affected.
                    </p>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" className="rounded-none" onClick={() => setConfirmCloseId(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            className="rounded-none"
                            disabled={isClosing}
                            onClick={() => {
                                if (!confirmCloseId) return
                                closeJob(confirmCloseId, { onSuccess: () => setConfirmCloseId(null) })
                            }}
                        >
                            {isClosing ? "Closing…" : "Close applications"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
