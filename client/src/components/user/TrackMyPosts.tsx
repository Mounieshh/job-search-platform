import { useEffect, useState } from "react"
import { Spinner } from "../ui/spinner"
import type { Job } from "../JobList"
import { Badge } from "../ui/badge"
import { baseUrl } from "@/lib/base"

const TrackMyPosts = () => {

    const [loading, setLoading] = useState(false)
    const [users, setUser] = useState<Job[]>([])

    useEffect(() => {
        const getUserJobs = async () => {
            try {

                setLoading(true)
                const response = await fetch(`${baseUrl}/api/jobs/user/post`, {
                    method: "GET",
                    credentials: "include"
                })
    
                if(!response.ok){
                    throw new Error("Failed to fetch the data")
                }
    
                const data = await response.json()

                const userJobs = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.userPostedJobs)
                        ? data.userPostedJobs
                        : Array.isArray(data?.jobs)
                            ? data.jobs
                            : []

                setUser(userJobs)
            } catch (error: any) {
                console.error(error.message)
            } finally {
                setLoading(false)
            }
        }
        getUserJobs()
    }, [])


    if(loading){
        return (
            <div className="min-h-screen flex justify-center pt-10">
                <Spinner className="size-7"/>
            </div>
        )
    }

    
  return (
    <div className="px-3 py-4 sm:px-6 sm:py-6">
        {users.length === 0 ? (
            <div className="text-center font-semibold p-5 text-muted-foreground">
                No Jobs Found
            </div>
        ): (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {users.map((user, index) => (
                    <div
                        key={user.id}
                        className="min-h-60 border border-border bg-card p-5 sm:p-6 flex flex-col justify-between gap-4"
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs font-mono text-muted-foreground">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                                    {user.companyName}
                                </span>
                            </div>

                            <h2 className="text-lg font-bold text-card-foreground leading-tight">
                                {user.title}
                            </h2>

                            {user.summary && (
                                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                    {user.summary}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-row justify-between items-end">
                            <div className="flex flex-wrap items-center gap-2 mb-6">
                                {user.location && (
                                    <span className="text-xs border border-border rounded-none px-2 py-0.5 text-muted-foreground">
                                        {user.location}
                                    </span>
                                )}
                                {user.salary && (
                                    <span className="text-xs border border-border rounded-none px-2 py-0.5 text-muted-foreground">
                                        {user.salary}
                                    </span>
                                )}

                                <Badge
                                    className={`uppercase font-semibold rounded-none 
                                        ${
                                            user.status === "approved"
                                            ? "bg-green-600"
                                            : user.status === "rejected"
                                            ? "bg-red-600"
                                            : "bg-amber-700"
                                        }`}
                                    >
                                    {user.status}
                                </Badge>
                            </div>

                            
                        </div>

                        {user.status === "rejected" && user.rejectedReason && (
                            <div className="mt-2 rounded-none border border-destructive/30 bg-destructive/10 p-2 text-xs text-destructive">
                                Rejection reason: {user.rejectedReason}
                            </div>
                        )}

                        
                    </div>
                ))}
            </div>
        )}
    </div>
  )
}

export default TrackMyPosts