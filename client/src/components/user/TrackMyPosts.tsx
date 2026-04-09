import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input"
import { useGetpostJobs } from "@/hooks/queries/postjob"
import StatusBadge from "../shared/StatusBadge"
import { Search, X } from "lucide-react"

const PAGE_SIZE = 6

const STATUS_OPTIONS = ["all", "pending", "approved", "rejected", "draft"]
const TYPE_OPTIONS = ["all", "Full_Time", "Part_Time", "Contract", "Internship"]

const TYPE_LABELS: Record<string, string> = {
    all: "All types",
    Full_Time: "Full Time",
    Part_Time: "Part Time",
    Contract: "Contract",
    Internship: "Internship",
}

export default function TrackMyPosts() {
    const { data, isPending, error } = useGetpostJobs()

    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [typeFilter, setTypeFilter] = useState("all")
    const [page, setPage] = useState(1)

    const filtered = useMemo(() => {
        if (!data?.jobs) return []
        const q = search.trim().toLowerCase()

        return data.jobs.filter((job) => {
            const matchesSearch = !q || [job.roleTitle, job.companyName, job.location]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
                .includes(q)

            const matchesStatus = statusFilter === "all" || job.status === statusFilter
            const matchesType = typeFilter === "all" || job.employmentType === typeFilter

            return matchesSearch && matchesStatus && matchesType
        })
    }, [data, search, statusFilter, typeFilter])

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    const resetFilters = () => {
        setSearch("")
        setStatusFilter("all")
        setTypeFilter("all")
        setPage(1)
    }

    const hasActiveFilters = search || statusFilter !== "all" || typeFilter !== "all"

    if (isPending) {
        return (
            <div className="min-h-50 flex items-center justify-center">
                <Spinner className="size-7" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-50 flex items-center justify-center">
                <p className="text-muted-foreground">Something went wrong</p>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">My Posts</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {data.jobs.length} job{data.jobs.length !== 1 ? "s" : ""} posted
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                        placeholder="Search by title, company or location..."
                        className="pl-9"
                    />
                </div>

                <div className="flex gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                        {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                                {s === "all" ? "All statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                        ))}
                    </select>

                    <select
                        value={typeFilter}
                        onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }}
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                        {TYPE_OPTIONS.map((t) => (
                            <option key={t} value={t}>{TYPE_LABELS[t]}</option>
                        ))}
                    </select>

                    {hasActiveFilters && (
                        <button
                            onClick={resetFilters}
                            className="inline-flex items-center gap-1 h-9 px-3 rounded-md border border-input text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        >
                            <X className="size-3.5" /> Clear
                        </button>
                    )}
                </div>
            </div>

            {paginated.length === 0 ? (
                <div className="min-h-50 flex flex-col items-center justify-center gap-2 text-center">
                    <p className="text-muted-foreground text-sm">
                        {hasActiveFilters ? "No jobs match your filters." : "You haven't posted any jobs yet."}
                    </p>
                    {hasActiveFilters && (
                        <button onClick={resetFilters} className="text-sm text-blue-400 underline underline-offset-2">
                            Clear filters
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {paginated.map((job) => (
                            <Card key={job.id} className="hover:shadow-sm transition-shadow gap-3">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base leading-snug">{job.roleTitle}</CardTitle>
                                    <CardDescription>{job.companyName}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex items-end justify-between">
                                    <div className="space-y-0.5">
                                        <p className="text-xs text-muted-foreground">{job.location}</p>
                                        <p className="text-xs text-muted-foreground">{TYPE_LABELS[job.employmentType] ?? job.employmentType}</p>
                                    </div>
                                    <StatusBadge status={job.status ?? "draft"} />
                                </CardContent>
                            </Card>
                        ))}
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
                                    className="h-8 px-3 rounded-md border border-input text-sm disabled:opacity-40 hover:bg-accent transition-colors"
                                >
                                    Prev
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={`h-8 w-8 rounded-md text-sm border transition-colors ${
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
                                    className="h-8 px-3 rounded-md border border-input text-sm disabled:opacity-40 hover:bg-accent transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
