import { useEffect, useMemo, useState } from "react"
import { Spinner } from "@/components/ui/spinner"
import { Search } from "lucide-react"
import { useBrowseJobs } from "@/hooks/queries/job"
import { Input } from "@/components/ui/input"
import { JobPagination } from "./JobPagination"
import { Link } from "react-router"


function toSlug(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
}

function toJobPath(companyName: string, title: string) {
    return `/joblistings/${encodeURIComponent(companyName)}/${encodeURIComponent(toSlug(title))}`
}

const JobList = () => {
    const [page, setPage] = useState(1)
    const limit = 10
    const { data, isPending, error } = useBrowseJobs(page, limit)
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
            <div className="min-h-[40vh] flex justify-center pt-10">
                <Spinner className="size-7" />
            </div>
        )
    }

    if (error) {
        return <div>Something went wrong</div>
    }

    return (
        <div className="px-3 py-3 sm:px-6 sm:py-4">
            
                <aside className="w-full mb-5">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                value={searchText}
                                onChange={(event) => setSearchText(event.target.value)}
                                placeholder="Search by title, company, or location"
                                className="pl-9 h-10"
                            />
                    </div>
                </aside>
            
                <section className="w-full lg:w-full space-y-6">
                    {filteredJobs.length === 0 ? (
                        <div className="border border-dashed border-border p-8 text-center bg-card">
                            <p className="text-base font-semibold">No matching jobs yet</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Try broadening your search keyword.
                            </p>
                        </div>
                    ) : (
                        <>
                        <div className="w-full">
                            {filteredJobs.map((job) => (
                                    <article
                                        key={job.id}
                                        className="min-h-15 border border-border bg-card p-5 sm:p-6 flex flex-col justify-between transition hover:-translate-y-0.5 hover:shadow-md"
                                    >
                                        <Link to={toJobPath(job.companyName, job.title)} className="space-y-1">
                                            <h2 className="text-lg font-semibold text-card-foreground leading-tight line-clamp-2">
                                                {job.title}
                                            </h2>
                                            <p>
                                                {job.companyName}
                                            </p>
                                            <h4>
                                                {job.location}
                                            </h4>

                                        </Link>

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
    )
}

export default JobList