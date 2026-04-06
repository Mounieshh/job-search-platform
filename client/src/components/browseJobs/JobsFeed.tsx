import { useApprovedJobs } from "@/hooks/queries/postjob"
import { Spinner } from "../ui/spinner"
import { Link, useParams } from "react-router"
import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

const JobsFeed = () => {
    const PAGE_SIZE = 10
    const [page, setPage] = useState(1)
    const [searchText, setSearchText] = useState("")
    const { jobId } = useParams()
    const { data, isPending, error} = useApprovedJobs(page, PAGE_SIZE)


    const filteredJobs = useMemo(() => {
            const normalizedQuery = searchText.trim().toLowerCase()
    
            return data?.jobs.filter((job) => {
                const combined = [job.roleTitle, job.companyName, job.location]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase()
                return !normalizedQuery || combined.includes(normalizedQuery)
            })
        }, [data, searchText])

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
            <section className="shrink-0">
                <div className="flex items-end justify-between border-b px-3 py-3">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            value={searchText}
                            onChange={(event) => setSearchText(event.target.value)}
                            placeholder="Search by title or content keyword"
                            className="pl-9 h-10 w-full"
                        />
                    </div>
                </div>
            </section>
            <section className="min-h-0 flex-1 overflow-y-auto">
                {filteredJobs?.length === 0 ? (
                    <div className="p-4 text-muted-foreground font-medium italic">Nothing to View</div>
                ) : (
                    filteredJobs?.map((job: any) => (
                        <Link
                            to={`/browseJobs/${job.id}`}
                            key={job.id}
                            className={`block border-b p-4 transition-colors hover:bg-muted/60 ${
                                jobId === job.id ? "bg-muted border-l-2 border-l-primary" : ""
                            }`}
                        >
                            <p className="font-medium text-black line-clamp-1">{job.roleTitle}</p>
                            <p className="text-sm text-muted-foreground">{job.companyName}</p>
                            <p className="text-xs text-muted-foreground mt-1">{job.location} · {job.employmentType}</p>
                        </Link>
                    ))
                )}
            </section>

            {filteredJobs && (
                <div className="flex shrink-0 items-center justify-between border-t bg-muted/20 px-4 py-3">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={page <= 1}
                        onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                        className="rounded-none h-8"
                    >
                        Previous
                    </Button>
                    <span className="text-xs text-muted-foreground">
                        Page {data.pagination.currentPage} of {Math.max(1, data.pagination.totalPages)} | {data.pagination.totalJobs} jobs
                    </span>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={page >= Math.max(1, data.pagination.totalPages)}
                        onClick={() => setPage((previous) => previous + 1)}
                        className="rounded-none h-8"
                    >
                        Next
                    </Button>
                </div>
            )}
        </section>
    )
}

export default JobsFeed