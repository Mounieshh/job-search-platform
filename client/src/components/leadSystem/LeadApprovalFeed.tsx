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
            <div className="min-h-screen flex justify-center items-center">
                <Spinner className="size-7" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-4 text-muted-foreground">No jobs listed to approve</div>
        )
    }

    return (
        <section className="flex flex-col">
            <div className="p-3 border-b">
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

            <section className="flex flex-col">
                {!filteredJobs || filteredJobs.length === 0 ? (
                    <div className="p-4 text-muted-foreground">Nothing to view</div>
                ) : (
                    filteredJobs.map((job) => (
                        <Link
                            to={`/lead-approval/${job.id}`}
                            key={job.id}
                            className={`p-4 border-b hover:bg-muted transition-colors ${
                                jobId === job.id ? "bg-muted border-l-2 border-l-primary" : ""
                            }`}
                        >
                            <p className="font-medium">{job.roleTitle}</p>
                            <p className="text-sm text-muted-foreground">{job.companyName}</p>
                            <p className="text-sm text-muted-foreground">{job.location}</p>
                            
                        </Link>
                    ))
                )}
            </section>
        </section>
    )
}

export default LeadApprovalFeed