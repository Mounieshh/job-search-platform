import { useApprovedJobs } from "@/hooks/queries/postjob"
import { Spinner } from "../ui/spinner"
import { Link, useParams } from "react-router"
import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

const JobsFeed = () => {
    const [page, setPage] = useState(1)
    const { data, isPending, error } = useApprovedJobs(page)
    const { jobId } = useParams()
    const [searchText, setSearchText] = useState("")

    const filteredJobs = useMemo(() => {
        const normalizedQuery = searchText.trim().toLowerCase()
        return data?.jobs?.filter((job: any) => {
            const combined = [job.roleTitle, job.location, job.companyName]
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
        <section className="flex flex-col space-y-4">
            <section>
                <div className="flex items-end justify-between pb-3">
                    <div className="relative w-full">
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
            <section className="flex flex-col min-h-100">
                {filteredJobs?.length === 0 ? (
                    <div className="p-4 text-muted-foreground font-medium italic">Nothing to View</div>
                ) : (
                    filteredJobs?.map((job: any) => (
                        <Link
                            to={`/browseJobs/${job.id}`}
                            key={job.id}
                            className={`p-4 border-b hover:bg-muted transition-colors ${
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

            {data?.pagination && data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="rounded-none h-8"
                    >
                        Previous
                    </Button>
                    <span className="text-xs text-muted-foreground">
                        Page {data.pagination.currentPage} of {data.pagination.totalPages}
                    </span>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={page === data.pagination.totalPages}
                        onClick={() => setPage(page + 1)}
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