import { useApprovedJobs } from "@/hooks/queries/postjob"
import { Spinner } from "../ui/spinner"
import { Link, useParams } from "react-router"
import { useDeferredValue, useMemo, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

const JobsFeed = () => {
    const PAGE_SIZE = 10
    const [page, setPage] = useState(1)
    const [searchText, setSearchText] = useState("")
    const deferredSearch = useDeferredValue(searchText)
    const { jobId } = useParams()
    const { data, isPending, error } = useApprovedJobs(page, PAGE_SIZE)

    const filteredJobs = useMemo(() => {
        const normalizedQuery = deferredSearch.trim().toLowerCase()
        return data?.jobs.filter((job: JobData) => {
            const combined = [job.roleTitle, job.companyName, job.location]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
            return !normalizedQuery || combined.includes(normalizedQuery)
        })
    }, [data, deferredSearch])

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
        <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border bg-background">
            <div className="shrink-0 border-b px-3 py-3">
                <label htmlFor="job-search" className="sr-only">Search jobs</label>
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" aria-hidden="true" />
                    <Input
                        id="job-search"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search by title, company, or location"
                        className="pl-9 h-10 w-full"
                    />
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto" role="list" aria-label="Job results">
                {filteredJobs?.length === 0 ? (
                    <p className="p-4 text-sm text-muted-foreground">
                        No jobs match your search
                    </p>
                ) : (
                    filteredJobs?.map((job: JobData) => (
                        <Link
                            to={`/browseJobs/${job.id}`}
                            key={job.id}
                            role="listitem"
                            className={`block border-b p-4 transition-colors duration-150 hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary ${
                                jobId === job.id ? "bg-accent" : ""
                            }`}
                            aria-current={jobId === job.id ? "page" : undefined}
                        >
                            <p className={`text-sm line-clamp-1 ${jobId === job.id ? "font-semibold text-foreground" : "font-medium text-foreground"}`}>
                                {job.roleTitle}
                            </p>
                            <p className="text-sm text-muted-foreground mt-0.5">{job.companyName}</p>
                            <p className="text-xs text-muted-foreground mt-1">{job.location} · {job.employmentType}</p>
                        </Link>
                    ))
                )}
            </div>

            {filteredJobs && (
                <div className="flex shrink-0 items-center justify-between border-t bg-muted/20 px-4 py-3">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="h-9 rounded"
                    >
                        Previous
                    </Button>
                    <span className="text-xs text-muted-foreground">
                        Page {data.pagination.currentPage} of {Math.max(1, data.pagination.totalPages)} · {data.pagination.totalJobs} jobs
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= Math.max(1, data.pagination.totalPages)}
                        onClick={() => setPage((p) => p + 1)}
                        className="h-9 rounded"
                    >
                        Next
                    </Button>
                </div>
            )}
        </section>
    )
}

export default JobsFeed
