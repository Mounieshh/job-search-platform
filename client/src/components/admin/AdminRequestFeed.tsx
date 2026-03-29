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
        const normalizedQuery = searchText.trim().toLowerCase()

        return data?.filter((job: JobDataWithUser) => {
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
            <div className="p-4 text-muted-foreground">Something went wrong</div>
        )
    }

    return (
        <section className="flex flex-col h-full">
            <section className="p-3 border-b">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        value={searchText}
                        onChange={(event) => setSearchText(event.target.value)}
                        placeholder="Search by title or keyword"
                        className="pl-9 h-10 w-full"
                    />
                </div>
            </section>
            <section className="flex flex-col overflow-y-auto">
                {!filteredJobs || filteredJobs.length === 0 ? (
                    <div className="p-4 text-sm text-muted-foreground">No pending jobs to approve</div>
                ) : (
                    filteredJobs.map((job) => (
                        <Link
                            to={`/admin/requests/${job.id}`}
                            key={job.id}
                            className={`p-4 border-b hover:bg-muted transition-colors flex flex-col gap-0.5 ${
                                jobId === job.id ? "bg-muted border-l-2 border-l-primary" : ""
                            }`}
                        >
                            <p className="font-medium text-sm">{job.roleTitle}</p>
                            <p className="text-xs text-muted-foreground">{job.companyName}</p>
                            <p className="text-xs text-muted-foreground">{job.location}</p>
                            {job.user && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    by {job.user.name}
                                </p>
                            )}
                        </Link>
                    ))
                )}
            </section>
        </section>
    )
}

export default AdminRequestFeed