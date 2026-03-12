import { useEffect, useState } from "react"
import { Spinner } from "../ui/spinner"
import { baseUrl } from "@/lib/base"
import { useAuth } from "@/context/AuthContext"
import { Link } from "react-router"
import { ArrowUpRight } from "lucide-react"

const LeadApproval = () => {

    const [data, setData] = useState<Job[]>([])
    const [loading, setLoading] = useState(false)

    const { user } = useAuth()

    function toSlug(title: string): string {
        return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
  } 

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true)
                const response = await fetch(`${baseUrl}/api/lead/requests`, {
                    method: "GET",
                    credentials: "include"
                })
    
                if(!response.ok){
                    throw new Error('Failed to fetch jobs')
                }
    
                const data = await response.json()
    
                setData(data.jobs || [])
            } catch (error: any) {
                throw new Error(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchJobs()
    },[])


    if(loading){
        return (
            <div className="min-h-screen flex justify-center">
                <Spinner className="size-7"/>
            </div>
        )
    }
  return (
    <div>
        {data.length === 0 ? (
            <div>
                No Data Found
            </div>
        ): (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.map((job, index) => (
                    <div key={job.id} className="min-h-52 border border-border bg-card p-5 sm:p-6 flex flex-col justify-between overflow-hidden">
                        <div className="flex-1 overflow-hidden">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-mono text-muted-foreground">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground truncate">
                                    {job.companyName}
                                </span>
                            </div>

                            <h2 className="text-lg font-bold text-card-foreground leading-tight line-clamp-1">
                                {job.title}
                            </h2>

                            {job.summary && (
                                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                    {job.summary}
                                </p>
                            )}
                        </div>


                        <div className="flex flex-row justify-between items-end mt-3">
                            <div className="flex flex-wrap items-center gap-2 mb-6">
                                {job.location && (
                                    <span className="text-xs border border-border rounded-none px-2 py-0.5 text-muted-foreground truncate max-w-30">
                                        {job.location}
                                    </span>
                                )}
                                {job.salary && (
                                    <span className="text-xs border border-border rounded-none px-2 py-0.5 text-muted-foreground truncate max-w-30">
                                        {job.salary}
                                    </span>
                                )}
                            </div>

                            {user && (
                                <Link
                                    to={`/lead/${encodeURIComponent(job.companyName || "company")}/${encodeURIComponent(toSlug(job.title))}`}
                                    className="flex items-center gap-1 text-sm font-medium border-t border-l border-border px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0"
                                >
                                    View Job <ArrowUpRight className="size-4" />
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  )
}

export default LeadApproval