import { Spinner } from "@/components/ui/spinner"
import { Link, useParams } from "react-router"
import { Search } from "lucide-react"
import { useLeadRequests } from "@/hooks/queries/lead"
import { Input } from "../ui/input"
import { useMemo, useState } from "react"

const LeadApprovalFeed = () => {
    const { data, isPending, error } = useLeadRequests()
    const { jobId } = useParams()
    const [searchText, setSearchText] = useState("")

    const filteredJobs = useMemo(() => {
        const normalizedQuery = searchText.trim().toLowerCase()
        return data?.filter((job) => {
            const combined = [job.roleTitle, job.location, job.companyName]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
            return !normalizedQuery || combined.includes(normalizedQuery)
        })
    }, [data, searchText])

    if (isPending) {
        return (
            <div className="flex justify-center items-center py-20">
                <Spinner className="size-6 text-muted-foreground" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center py-20 text-sm text-muted-foreground">
                No pending jobs to review
            </div>
        )
    }

    return (
        <section className="flex h-full flex-col bg-background">
            <div className="border-b border-border px-3 py-3">
                <div className="relative w-full">
                    <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        value={searchText}
                        onChange={(event) => setSearchText(event.target.value)}
                        placeholder="Search jobs..."
                        aria-label="Search pending jobs"
                        className="pl-9 h-10 w-full border-border shadow-none focus-visible:ring-0 rounded-md"
                    />
                </div>
            </div>

            <section className="flex flex-1 flex-col overflow-y-auto">
                {!filteredJobs || filteredJobs.length === 0 ? (
                    <div className="flex justify-center items-center py-20 text-sm text-muted-foreground">
                        No pending jobs to review
                    </div>
                ) : (
                    filteredJobs.map((job) => (
                        <Link
                            to={`/lead-approval/${job.id}`}
                            key={job.id}
                            className={`p-4 border-b border-border transition-colors ${
                                jobId === job.id
                                    ? "bg-primary/5"
                                    : "hover:bg-accent"
                            }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <p className="text-sm font-medium text-foreground line-clamp-1 pr-2">{job.roleTitle}</p>
                                <span className="inline-flex shrink-0 items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary uppercase tracking-wider">
                                    Pending
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                                {job.companyName} &middot; {job.location}
                            </p>
                            {job.user?.name ? (
                                <p className="text-xs text-muted-foreground/70 mt-1">by {job.user.name}</p>
                            ) : null}
                        </Link>
                    ))
                )}
            </section>
        </section>
    )
}

export default LeadApprovalFeed
