import { useState } from "react"
import { useParams, Link } from "react-router"
import { ArrowLeft, Github, FileText, Sparkles, ChevronDown, ChevronUp, Check, X } from "lucide-react"
import { useLeadJobApplications } from "@/hooks/queries/lead"
import { useShortlistTopApplications, useManualShortlist } from "@/hooks/mutations/lead"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import StatusBadge from "@/components/shared/StatusBadge"
import { JobPagination } from "@/components/shared/JobPagination"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import type { LeadApplicationItem } from "@/api/lead"

type ApplicationCardProps = {
    application: LeadApplicationItem
    onShortlist: (id: string) => void
    onReject: (id: string) => void
    isUpdating: boolean
}

function ScoreBar({ score }: { score: number }) {
    const color =
        score >= 75 ? "bg-green-500" :
        score >= 50 ? "bg-amber-400" :
        "bg-red-400"

    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${score}%` }} />
            </div>
            <span className="text-xs font-mono font-medium text-gray-600 w-7 text-right">{score}</span>
        </div>
    )
}

function ApplicationCard({ application, onShortlist, onReject, isUpdating }: ApplicationCardProps) {
    const [expanded, setExpanded] = useState(false)
    const [showAiBreakdown, setShowAiBreakdown] = useState(false)
    const hasAiData = application.aiScore !== null || application.aiReason || application.aiSuggestions
    const isActioned = application.status === "shortlisted" || application.status === "rejected"

    return (
        <div className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50/50 transition-colors">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                        {application.applicant?.name ?? "Unknown applicant"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {application.applicant?.email ?? ""}
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {application.aiScore !== null && (
                        <button
                            onClick={() => setShowAiBreakdown((prev) => !prev)}
                            className="inline-flex items-center gap-1 text-xs font-mono text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full hover:bg-amber-100 transition-colors"
                        >
                            <Sparkles className="size-3" /> {application.aiScore}
                        </button>
                    )}
                    <StatusBadge status={application.status} />
                </div>
            </div>

            {showAiBreakdown && hasAiData && (
                <div className="mt-3 rounded-md bg-amber-50 border border-amber-100 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-mono uppercase tracking-wider text-amber-600 flex items-center gap-1">
                            <Sparkles className="size-3" /> AI Score Breakdown
                        </p>
                        {application.aiScore !== null && (
                            <ScoreBar score={application.aiScore} />
                        )}
                    </div>
                    {application.aiReason && (
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Why this score</p>
                            <p className="text-xs text-gray-700 leading-relaxed">{application.aiReason}</p>
                        </div>
                    )}
                    {application.aiSuggestions && (
                        <div className="space-y-0.5 pt-1 border-t border-amber-100">
                            <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Recruiter suggestion</p>
                            <p className="text-xs text-gray-700 leading-relaxed">{application.aiSuggestions}</p>
                        </div>
                    )}
                </div>
            )}

            <div className="flex items-center gap-3 mt-3">
                {application.resume && (
                    <a
                        href={application.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                        <FileText className="size-3" /> Resume
                    </a>
                )}
                {application.githubLink && (
                    <a
                        href={application.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                        <Github className="size-3" /> GitHub
                    </a>
                )}
                {application.profile && (
                    <button
                        onClick={() => setExpanded((prev) => !prev)}
                        className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 ml-auto"
                    >
                        {expanded ? <><ChevronUp className="size-3" /> Less</> : <><ChevronDown className="size-3" /> Profile</>}
                    </button>
                )}
            </div>

            {expanded && application.profile && (
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                    {application.profile.location && (
                        <p className="text-xs text-gray-500">
                            <span className="font-medium text-gray-700">Location:</span> {application.profile.location}
                        </p>
                    )}
                    {application.profile.phone && (
                        <p className="text-xs text-gray-500">
                            <span className="font-medium text-gray-700">Phone:</span> {application.profile.phone}
                        </p>
                    )}
                    {application.profile.skills && application.profile.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {application.profile.skills.map((skill, i) => (
                                <Badge key={i} variant="secondary" className="text-[10px] px-2 py-0 font-normal bg-gray-100 text-gray-600 hover:bg-gray-100">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    )}
                    {application.profile.publicLinks && Object.entries(application.profile.publicLinks).filter(([, v]) => v).length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(application.profile.publicLinks)
                                .filter(([, v]) => v)
                                .map(([key, url]) => (
                                    <a key={key} href={url as string} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline capitalize">
                                        {key}
                                    </a>
                                ))}
                        </div>
                    )}
                </div>
            )}

            {!isActioned && (
                <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={isUpdating}
                        onClick={() => onReject(application.id)}
                        className="h-7 text-xs border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 shadow-none"
                    >
                        <X className="size-3 mr-1" /> Reject
                    </Button>
                    <Button
                        size="sm"
                        disabled={isUpdating}
                        onClick={() => onShortlist(application.id)}
                        className="h-7 text-xs bg-primary hover:bg-green-700 text-white shadow-none"
                    >
                        <Check className="size-3 mr-1" /> Shortlist
                    </Button>
                </div>
            )}
        </div>
    )
}

export default function ManageJobApplications() {
    const { jobId } = useParams<{ jobId: string }>()
    const [page, setPage] = useState(1)
    const [rejectTarget, setRejectTarget] = useState<string | null>(null)
    const [rejectReason, setRejectReason] = useState("")

    const { data, isPending, error } = useLeadJobApplications(jobId, page)
    const { mutate: generateSuggestions, isPending: isGenerating } = useShortlistTopApplications()
    const { mutate: manualAction, isPending: isUpdating } = useManualShortlist(jobId ?? "")

    const handleShortlist = (applicationId: string) => {
        manualAction(
            { applicationId, action: "shortlist" },
            { onSuccess: () => toast.success("Application shortlisted") }
        )
    }

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

    if (isPending) {
        return (
            <div className="min-h-50 flex justify-center items-center">
                <Spinner className="size-6 text-gray-400" />
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="min-h-50 flex justify-center items-center text-sm text-gray-500">
                Unable to load applications for this job
            </div>
        )
    }

    const { job, applications, stats, pagination } = data

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <Link
                    to="/lead/posted"
                    className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
                >
                    <ArrowLeft className="size-3.5" /> Back to posted jobs
                </Link>

                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">{job.roleTitle}</h1>
                        <p className="text-sm text-gray-400 mt-0.5">
                            {job.companyName} &middot; {job.location} &middot; {job.employmentType}
                        </p>
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={isGenerating || applications.length === 0}
                        onClick={() => jobId && generateSuggestions({ jobId })}
                        className="shrink-0 gap-1.5 shadow-none"
                    >
                        <Sparkles className="size-3.5" />
                        {isGenerating ? "Analyzing..." : "AI Suggestions"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: "Total", value: stats.total },
                    { label: "Pending", value: stats.pending },
                    { label: "Shortlisted", value: stats.shortlisted },
                    { label: "Rejected", value: stats.rejected },
                ].map((stat) => (
                    <div key={stat.label} className="rounded-lg border border-gray-100 p-3 text-center">
                        <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-400 mt-0.5 font-mono uppercase tracking-wider">{stat.label}</p>
                    </div>
                ))}
            </div>

            {applications.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-16">No applications yet for this job.</p>
            ) : (
                <div className="space-y-3">
                    {applications.map((application) => (
                        <ApplicationCard
                            key={application.id}
                            application={application}
                            onShortlist={handleShortlist}
                            onReject={(id) => setRejectTarget(id)}
                            isUpdating={isUpdating}
                        />
                    ))}
                </div>
            )}

            {pagination.totalPages > 1 && (
                <div className="pt-2">
                    <JobPagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        onPageChange={setPage}
                    />
                </div>
            )}

            <Dialog open={Boolean(rejectTarget)} onOpenChange={(open) => {
                if (!open) {
                    setRejectTarget(null)
                    setRejectReason("")
                }
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reason for Rejection</DialogTitle>
                    </DialogHeader>
                    <Textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Explain why this application is being rejected..."
                        className="min-h-28"
                    />
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
        </div>
    )
}
