import { useAdminReviewedJobs } from "@/hooks/queries/admin"
import { Spinner } from "../ui/spinner"
import { Link, useParams } from "react-router"
import { Input } from "../ui/input"
import { Search } from "lucide-react"
import { useMemo, useState } from "react"

type StatusFilter = "all" | "approved" | "rejected"

const AdminApprovedFeed = () => {
    const { data, isPending, error } = useAdminReviewedJobs()
    const { jobId } = useParams()
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState<StatusFilter>("all")

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase()
        return (data ?? []).filter(job => {
            const matchesStatus = status === "all" || job.status === status
            const matchesSearch = !q || [job.roleTitle, job.companyName].join(" ").toLowerCase().includes(q)
            return matchesStatus && matchesSearch
        })
    }, [data, search, status])

    if (isPending) return (
        <div className="flex justify-center items-center py-20">
            <Spinner className="size-6 text-muted-foreground" />
        </div>
    )

    if (error) return (
        <div className="p-4 text-sm text-destructive">Error loading reviewed jobs.</div>
    )

    return (
        <nav aria-label="Reviewed jobs list">
            {/* Header */}
            <div className="px-4 py-3 border-b border-border space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        History
                    </h2>
                    <span className="text-xs text-muted-foreground">{filtered.length}</span>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                    <Input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search…"
                        aria-label="Search reviewed jobs"
                        className="pl-8 h-8 text-sm"
                    />
                </div>

                {/* Filter tabs */}
                <div className="flex gap-1" role="group" aria-label="Filter by status">
                    {(["all", "approved", "rejected"] as StatusFilter[]).map(s => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => setStatus(s)}
                            className={`flex-1 rounded py-1 text-xs font-medium capitalize transition-colors ${
                                status === s
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            {filtered.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">
                    {search || status !== "all" ? "No jobs match your filters." : "No reviewed jobs yet."}
                </p>
            ) : (
                <ul role="list">
                    {filtered.map(job => {
                        const isActive = jobId === job.id
                        const isApproved = job.status === "approved"
                        return (
                            <li key={job.id}>
                                <Link
                                    to={`/admin/reviewed/${job.id}`}
                                    aria-current={isActive ? "page" : undefined}
                                    className={`flex items-start justify-between gap-3 px-4 py-3 border-b border-border transition-colors ${
                                        isActive ? "bg-primary/5" : "hover:bg-accent"
                                    }`}
                                >
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">{job.roleTitle}</p>
                                        <p className="text-xs text-muted-foreground truncate mt-0.5">{job.companyName}</p>
                                    </div>
                                    <span className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                                        isApproved
                                            ? "bg-primary/10 text-primary"
                                            : "bg-destructive/10 text-destructive"
                                    }`}>
                                        {job.status}
                                    </span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            )}
        </nav>
    )
}

export default AdminApprovedFeed
