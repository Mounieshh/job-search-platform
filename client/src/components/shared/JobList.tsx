import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router"
import { Spinner } from "@/components/ui/spinner"
import { ArrowUpRight, Search } from "lucide-react"
import { useBrowseJobs } from "@/hooks/queries/job"
import { useSession } from "@/hooks/queries/auth"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { JobPagination } from "./JobPagination"


function toSlug(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
}

const JobList = () => {
    const [page, setPage] = useState(1)
    const limit = 10
    const { data, isPending, error } = useBrowseJobs(page, limit)
    const { data: user } = useSession()
    const [searchText, setSearchText] = useState("")

    const jobs = data?.jobs ?? []
    const currentPage = data?.currentPage ?? 1
    const totalPages = data?.totalPages ?? 1

    useEffect(() => {
        setPage(1)
    }, [searchText])

    const filteredJobs = useMemo(() => {
        const normalizedQuery = searchText.trim().toLowerCase()

        return jobs.filter((job) => {
            const combined = [job.title, job.companyName, job.location, job.summary]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
            return !normalizedQuery || combined.includes(normalizedQuery)
        })
    }, [jobs, searchText])

    if (isPending) {
        return (
            <div className="min-h-screen flex justify-center pt-10">
                <Spinner className="size-7" />
            </div>
        )
    }

    if (error) {
        return <div>Something went wrong</div>
    }

    return (
        <div className="px-3 py-3 sm:px-6 sm:py-4">
            <div className="mx-auto max-w-6xl w-full flex flex-col lg:flex-row gap-4 lg:gap-6 items-start">
                
                <aside className="w-full lg:w-[28%] lg:sticky lg:top-20">
                    <div className="border border-border bg-card p-5 sm:p-6 space-y-3">
                        <h1 className="text-lg sm:text-md font-semibold text-card-foreground italic">
                            Browse job listings
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Find roles by title, company, or location.
                        </p>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                value={searchText}
                                onChange={(event) => setSearchText(event.target.value)}
                                placeholder="Search by title, company, or location"
                                className="pl-9 h-10"
                            />
                        </div>
                    </div>
                </aside>

                <section className="w-full lg:w-[72%] space-y-6">
                    {filteredJobs.length === 0 ? (
                        <div className="border border-dashed border-border p-8 text-center bg-card">
                            <p className="text-base font-semibold">No matching jobs yet</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Try removing one filter or broadening your search keyword.
                            </p>
                        </div>
                    ) : (
                        <>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {filteredJobs.map((job, index) => (
                                <article
                                    key={job.id}
                                    className="group min-h-60 border border-border bg-card p-5 sm:p-6 flex flex-col justify-between transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="text-xs font-mono text-muted-foreground">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>
                                            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground truncate">
                                                {job.companyName}
                                            </span>
                                        </div>

                                        <h2 className="text-lg font-semibold text-card-foreground leading-tight line-clamp-2">
                                            {job.title}
                                        </h2>

                                        {job.summary && (
                                            <p className="text-sm text-muted-foreground line-clamp-3">{job.summary}</p>
                                        )}

                                    </div>

                                    <div className="mt-4 space-y-4">
                                        <div className="flex flex-wrap items-center gap-2">
                                            {job.location && <Badge variant="outline">{job.location}</Badge>}
                                            {job.salary && <Badge variant="outline">{job.salary}</Badge>}
                                        </div>

                                        {user ? (
                                            <Link
                                                to={`/jobs/${encodeURIComponent(job.companyName || "company")}/${encodeURIComponent(toSlug(job.title))}`}
                                                className="inline-flex items-center gap-1 text-sm font-medium border border-border px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                                            >
                                                Open Details <ArrowUpRight className="size-4" />
                                            </Link>
                                        ) : (
                                            <Link
                                                to="/auth/login"
                                                className="inline-flex items-center gap-1 text-sm font-medium border border-border px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                                            >
                                                Sign In to View <ArrowUpRight className="size-4" />
                                            </Link>
                                        )}
                                    </div>
                                </article>
                        ))}
                        </div>
                        {totalPages > 1 && (
                            <div className="pt-2">
                                <JobPagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setPage}
                                />
                            </div>
                        )}
                        </>
                    )}
                </section>
            </div>
        </div>
    )
}

export default JobList