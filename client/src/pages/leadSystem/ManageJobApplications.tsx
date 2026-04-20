import { useEffect, useMemo, useState } from "react"
import { useParams, Link } from "react-router"
import { ArrowLeft, Sparkles, X, Search, Loader2, ArrowUpDown } from "lucide-react"
import { useLeadJobApplications } from "@/hooks/queries/lead"
import { useShortlistByText, useManualShortlist } from "@/hooks/mutations/lead"
import { type ColDef } from "ag-grid-community"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { AgGridReact } from "ag-grid-react"

const PAGE_SIZE = 10
const STATUS_OPTIONS = [
    { value: "all", label: "All statuses" },
    { value: "pending", label: "Pending" },
    { value: "ai_suggested", label: "AI scored" },
    { value: "shortlisted", label: "Shortlisted" },
    { value: "rejected", label: "Rejected" },
]


type ApplicationGridRow = {
    index: number
    name: string
    email: string
    status: string
    aiScore: number | null
    appliedOn: string
}


type TextShortlistDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    jobId: string
    isPending: boolean
    onSubmit: (criteria: string) => void
}

function TextShortlistDialog({ open, onOpenChange, isPending, onSubmit }: TextShortlistDialogProps) {
    const [criteria, setCriteria] = useState("")

    const handleSubmit = () => {
        if (!criteria.trim()) {
            toast.error("Please enter shortlisting criteria")
            return
        }
        onSubmit(criteria.trim())
    }

    const handleOpenChange = (next: boolean) => {
        if (!isPending) {
            onOpenChange(next)
            if (!next) setCriteria("")
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        AI Suggestions
                    </DialogTitle>
                    <DialogDescription>
                        Describe what you're looking for. The AI will score all candidates strictly against your criteria.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                    

                    <div className="space-y-1.5">
                        <label htmlFor="shortlist-criteria" className="sr-only">Shortlisting criteria</label>
                        <Textarea
                            id="shortlist-criteria"
                            value={criteria}
                            onChange={(e) => setCriteria(e.target.value)}
                            placeholder="e.g. Candidates with 3+ years React experience and strong TypeScript skills..."
                            className="min-h-28 resize-none"
                            disabled={isPending}
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleOpenChange(false)}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isPending || !criteria.trim()}
                        className="gap-1.5"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="size-3.5 animate-spin" />
                                Analysing...
                            </>
                        ) : (
                            <>
                                <Sparkles className="size-3.5" />
                                Generate suggestions
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function ManageJobApplications() {
    const { jobId } = useParams<{ jobId: string }>()
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [sortByScore, setSortByScore] = useState(false)
    const [rejectTarget, setRejectTarget] = useState<string | null>(null)
    const [rejectReason, setRejectReason] = useState("")
    const [textShortlistOpen, setTextShortlistOpen] = useState(false)

    // Fetch all at once for client-side filtering
    const { data, isPending, error } = useLeadJobApplications(jobId, 1, 1000)
    const { mutate: manualAction, isPending: isUpdating } = useManualShortlist(jobId ?? "")
    const { mutate: shortlistByText, isPending: isShortlisting } = useShortlistByText(jobId ?? "")
    const applications = data?.applications ?? []

    const handleRejectConfirm = () => {
        if (!rejectTarget) return
        if (!rejectReason.trim()) {
            toast.error("Please provide a reason")
            return
        }
        manualAction(
            { applicationId: rejectTarget, action: "reject", reason: rejectReason.trim() },
            {
                onSuccess: () => {
                    toast.success("Application rejected")
                    setRejectTarget(null)
                    setRejectReason("")
                },
            }
        )
    }

    const handleTextShortlist = (criteria: string) => {
        shortlistByText(criteria, {
            onSuccess: () => {
                setTextShortlistOpen(false)
            },
        })
    }

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase()
        const result = applications.filter((app) => {
            const matchesSearch = !q || [app.applicant?.name, app.applicant?.email]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
                .includes(q)
            const matchesStatus = statusFilter === "all" || app.status === statusFilter
            return matchesSearch && matchesStatus
        })
        if (sortByScore) {
            result.sort((a, b) => (b.aiScore ?? -1) - (a.aiScore ?? -1))
        }
        return result
    }, [applications, search, statusFilter, sortByScore])

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    const hasActiveFilters = search || statusFilter !== "all" || sortByScore

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages)
        }
    }, [page, totalPages])

    const gridRowData = useMemo<ApplicationGridRow[]>(() => {
        return paginated.map((application, index) => ({
            index: (page - 1) * PAGE_SIZE + index + 1,
            name: application.applicant?.name ?? "Unknown applicant",
            email: application.applicant?.email ?? "-",
            status: application.status,
            aiScore: application.aiScore,
            appliedOn: new Date(application.createdAt).toLocaleDateString(),
        }))
    }, [paginated, page])

    const gridColumnDefs = useMemo<ColDef<ApplicationGridRow>[]>(() => {
        return [
            { field: "index", headerName: "S.No", width: 90, sortable: false },
            { field: "name", headerName: "Applicant", minWidth: 180 },
            { field: "email", headerName: "Email", minWidth: 220 },
            { field: "status", headerName: "Status", minWidth: 130 },
            {
                field: "aiScore",
                headerName: "AI Score",
                minWidth: 120,
                valueFormatter: ({ value }) => (value === null ? "-" : String(value)),
            },
            { field: "appliedOn", headerName: "Applied On", minWidth: 130 },
        ]
    }, [])

    if (isPending) {
        return (
            <div className="min-h-50 flex justify-center items-center">
                <Spinner className="size-6 text-muted-foreground" />
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="min-h-50 flex justify-center items-center text-sm text-muted-foreground">
                Unable to load applications for this job
            </div>
        )
    }

    const { job } = data

    const resetFilters = () => {
        setSearch("")
        setStatusFilter("all")
        setSortByScore(false)
        setPage(1)
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div>
                <Link
                    to="/lead/posted"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
                >
                    <ArrowLeft className="size-3.5" /> Back to posted jobs
                </Link>

                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">{job.roleTitle}</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {job.companyName} &middot; {job.location} &middot; {job.employmentType.replace("_", " ")}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Drawer direction="right">
                            <DrawerTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="shrink-0 gap-1.5 shadow-none"
                                    size="sm"
                                >
                                    Job Description
                                </Button>
                            </DrawerTrigger>
                            <DrawerContent>
                                <DrawerHeader className="border-b border-border pb-4">
                                    <DrawerTitle className="text-base font-semibold pr-10">
                                        {job.roleTitle}
                                    </DrawerTitle>
                                    <DrawerDescription className="text-xs text-muted-foreground mt-0.5">
                                        {job.companyName} &middot; {job.location}
                                    </DrawerDescription>
                                    <DrawerClose asChild>
                                        <Button variant="ghost" size="icon-sm" className="absolute right-3 top-3">
                                            <X className="size-4" />
                                            <span className="sr-only">Close</span>
                                        </Button>
                                    </DrawerClose>
                                </DrawerHeader>
                                <div className="no-scrollbar overflow-y-auto px-4 py-4 pb-8 flex-1">
                                    <div
                                        dangerouslySetInnerHTML={{ __html: job.description }}
                                        className="prose prose-sm max-w-none text-foreground"
                                    />
                                </div>
                            </DrawerContent>
                        </Drawer>
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={applications.length === 0}
                            onClick={() => setTextShortlistOpen(true)}
                            className="shrink-0 gap-1.5 shadow-none"
                        >
                            <Sparkles className="size-3.5" />
                            AI Suggestions
                        </Button>
                    </div>
                </div>
            </div>

            
            <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                        placeholder="Search by name or email..."
                        className="pl-9"
                    />
                </div>
                <div className="flex gap-2">
                    <label htmlFor="status-filter" className="sr-only">Filter by status</label>
                    <select
                        id="status-filter"
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                        {STATUS_OPTIONS.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => { setSortByScore((prev) => !prev); setPage(1) }}
                        aria-label={sortByScore ? "Remove AI score sort" : "Sort by AI score"}
                        aria-pressed={sortByScore}
                        className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-md border text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
                            sortByScore
                                ? "border-primary/30 bg-primary/5 text-primary"
                                : "border-input text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                    >
                        <ArrowUpDown className="size-3.5" />
                        AI score
                    </button>
                    {hasActiveFilters && (
                        <button
                            onClick={resetFilters}
                            aria-label="Clear all filters"
                            className="inline-flex items-center gap-1 h-9 px-3 rounded-md border border-input text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                        >
                            <X className="size-3.5" /> Clear
                        </button>
                    )}                </div>
            </div>

            {paginated.length === 0 ? (
                <div className="min-h-50 flex flex-col items-center justify-center gap-2 text-center">
                    <p className="text-sm text-muted-foreground">
                        {hasActiveFilters ? "No applications match your filters." : "No applications yet for this job."}
                    </p>
                    {hasActiveFilters && (
                        <button
                            onClick={resetFilters}
                            className="text-sm text-primary underline underline-offset-2 hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="ag-theme-alpine" style={{ height: 320 }}>
                        <AgGridReact<ApplicationGridRow>
                            rowData={gridRowData}
                            columnDefs={gridColumnDefs}
                            defaultColDef={{
                                sortable: true,
                                filter: true,
                                resizable: true,
                                flex: 1,
                            }}
                            pagination={true}
                        />
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-2">
                            <p className="text-xs text-muted-foreground">
                                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                            </p>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page <= 1}
                                    aria-label="Previous page"
                                    className="h-8 px-3 rounded-md border border-input text-sm disabled:opacity-40 hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                                >
                                    Prev
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        aria-label={`Page ${p}`}
                                        aria-current={p === page ? "page" : undefined}
                                        className={`h-8 w-8 rounded-md text-sm border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
                                            p === page
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "border-input hover:bg-accent"
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page >= totalPages}
                                    aria-label="Next page"
                                    className="h-8 px-3 rounded-md border border-input text-sm disabled:opacity-40 hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            <Dialog
                open={Boolean(rejectTarget)}
                onOpenChange={(open) => {
                    if (!open) {
                        setRejectTarget(null)
                        setRejectReason("")
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reason for Rejection</DialogTitle>
                        <DialogDescription className="sr-only">
                            Provide a reason for rejecting this application. This will be recorded and may be shared with the applicant.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-1.5">
                        <label htmlFor="rejection-reason" className="sr-only">Rejection reason</label>
                        <Textarea
                            id="rejection-reason"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Explain why this application is being rejected..."
                            className="min-h-28"
                        />
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setRejectTarget(null)
                                setRejectReason("")
                            }}
                            disabled={isUpdating}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleRejectConfirm}
                            disabled={isUpdating || !rejectReason.trim()}
                        >
                            {isUpdating ? "Rejecting..." : "Confirm Reject"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {jobId && (
                <TextShortlistDialog
                    open={textShortlistOpen}
                    onOpenChange={setTextShortlistOpen}
                    jobId={jobId}
                    isPending={isShortlisting}
                    onSubmit={handleTextShortlist}
                />
            )}
        </div>
    )
}
