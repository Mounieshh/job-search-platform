import { useEffect, useState } from "react"
import { Link } from "react-router"
import { Spinner } from "./ui/spinner"
import { ArrowUpRight } from "lucide-react"
import { useAuth } from "@/context/AuthContext"


type User = {
    _id: string,
    name: string,
    email: string,
    emailDomain: string,
    userType: string,
    role: string
}
export type Job = {
    id: string,
    title: string,
    description: string,
    companyName: string,
    location?: string,
    salary?: string,
    url?: string,
    status: string,
    postedBy: string,
    user: User | null
}


const JobList = () => {
    
    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(false)

    const { user } = useAuth()

    useEffect(() => {
        const getJobs = async () => {
            try {
                setLoading(true)

                const response = await fetch("http://localhost:5000/api/jobs", {
                    method: "GET",
                    credentials: "include"
                })
    
                if(!response.ok){
                    throw new Error("Failed to Fetch Jobs")
                }
    
                const data = await response.json()
                setJobs(data.jobs || data)
            } catch (error: any) {
                console.log(error.message);
            } finally {
                setLoading(false)
            }
        }

        getJobs()
    }, [])

    if(loading){
        return  (
            <div className="min-h-screen flex justify-center pt-10">
                <Spinner className="size-7"/>
            </div>
        )
    }

  return (
    <div className="p-6">
        {jobs.length === 0 ? (
            <div className="text-center font-semibold p-5 text-muted-foreground">
                No Jobs Found
            </div>
        ): (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job, index) => (
                    <div
                        key={job.id}
                        className="border border-border bg-card p-6 flex flex-col justify-between gap-4"
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs font-mono text-muted-foreground">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                                    {job.companyName}
                                </span>
                            </div>

                            <h2 className="text-lg font-bold text-card-foreground leading-tight">
                                {job.title}
                            </h2>

                            {job.description && (
                                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                    {job.description}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-row justify-between items-end -mb-6 -mr-6">
                            <div className="flex flex-wrap items-center gap-2 mb-6">
                                {job.location && (
                                    <span className="text-xs border border-border rounded-sm px-2 py-0.5 text-muted-foreground">
                                        {job.location}
                                    </span>
                                )}
                                {job.salary && (
                                    <span className="text-xs border border-border rounded-sm px-2 py-0.5 text-muted-foreground">
                                        {job.salary}
                                    </span>
                                )}
                            </div>

                            {user && job.url && (
                                    <Link
                                        to={job.url}
                                        target="_blank"
                                        className="flex items-center gap-1 text-sm font-medium border-t border-l border-border px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                                    >
                                        Apply <ArrowUpRight className="size-4" />
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

export default JobList