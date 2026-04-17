import { useAdminPendingJobs } from "@/hooks/queries/admin"
import { Spinner } from "../ui/spinner"
import { Link, useParams } from "react-router"
import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "../ui/input"

const AdminRequestFeed = () => {
    const { data, isPending, error } = useAdminPendingJobs()
    const { jobId } = useParams()
    const [searchText, setSearchText] = useState("")

    const filteredJobs = useMemo(() => {
        const q = searchText.trim().toLowerCase()
        return data?.filter((job: JobDataWithUser) => {
            const combined = [job.roleTitle, job.location, job.companyName]
                .filter(Boolean).join(" ").toLowerCase()
            return !q || combined.includes(q)
        })
    }, [data, searchText])

    if (isPending) return (
        <div className="flex justify-center items-center py-20">
            <Spinner className="size-6 text-muted-foreground" />
        </div>
    )

    if (error) return (
        <div className="p-4 text-sm text-muted-foreground">Something went wrong.</div>
    )

    return (
        <section className="flex flex-col h-full">
            <div className="p-3 border-b border-border">
                <div className="relative w-full">
                    <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <Input
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        placeholder="Search by title or keyword…"
                        aria-label="Search pending jobs"
                        className="pl-9 h-9 w-full"
                    />
                </div>
            </div>
            <div className="flex flex-col overflow-y-auto">
                {!filteredJobs || filteredJobs.length === 0 ? (
                    <div className="p-4 text-sm text-muted-foreground">No pending jobs to approve.</div>
                ) : (
                    filteredJobs.map(job => (
                        <Link
                            to={`/admin/requests/${job.id}`}
                            key={job.id}
                            className={`p-4 border-b border-border transition-colors flex flex-col gap-0.5 ${
                                jobId === job.id ? "bg-primary/5" : "hover:bg-accent"
                            }`}
                        >
                            <p className="font-medium text-sm text-foreground">{job.roleTitle}</p>
                            <p className="text-xs text-muted-foreground">{job.companyName}</p>
                            <p className="text-xs text-muted-foreground">{job.location}</p>
                            {job.user && (
                                <p className="text-xs text-muted-foreground mt-1">by {job.user.name}</p>
                            )}
                        </Link>
                    ))
                )}
            </div>
        </section>
    )
}

export default AdminRequestFeed
