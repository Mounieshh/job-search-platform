import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import { Spinner } from "@/components/ui/spinner"
import { ArrowUpRight } from "lucide-react"

type JobDetail = {
  id: string
  title: string
  description?: string | null
  companyName?: string | null
  location?: string | null
  salary?: string | null
  url?: string | null
  status: string
  source: string
  createdAt: string
}

export default function JobDetailPage() {
  const { companyName, slugId } = useParams()
  const [job, setJob] = useState<JobDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!companyName || !slugId) {
      setError("Invalid job link")
      return
    }

    const getJobBySlug = async () => {
      try {
        setLoading(true)
        setError("")

        const response = await fetch(
          `http://localhost:5000/api/jobs/${companyName}/${slugId}`,
          {
            method: "GET",
            credentials: "include",
          }
        )

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.message || "Failed to fetch job")
        }

        const data = await response.json()
        setJob(data.job)
      } catch (err: any) {
        setError(err.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    getJobBySlug()
  }, [companyName, slugId])

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center pt-10">
        <Spinner className="size-7" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="border border-border bg-card p-6 text-sm text-destructive">{error}</div>
      </div>
    )
  }

  if (!job) {
    return null
  }

  return (

    <>
    <div className="pt-4 w-22 mt-5 flex items-center justify-center font-bold">
        <Link
          to="/joblistings"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Back to Jobs
        </Link>
      </div>
    <div className="p-6 max-w-5xl flex gap-6">
        <div className="flex-1 border border-border bg-card p-6 space-y-5">
            
        <div>
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            {job.companyName}
            </p>

            <h1 className="text-2xl font-bold text-card-foreground mt-2">
            {job.title}
            </h1>
        </div>

        {job.description && (
            <p className="text-sm text-muted-foreground whitespace-pre-line">
            {job.description}
            </p>
        )}
        </div>

        <div className="w-72 border border-border bg-card p-6 space-y-6">
        <div>
            <p className="text-xs uppercase text-muted-foreground">Salary</p>
            <p className="text-lg font-semibold text-card-foreground">
            {job.salary || "Not disclosed"}
            </p>
        </div>

        <div>
            <p className="text-xs uppercase text-muted-foreground">Location</p>
            <p className="text-sm text-card-foreground">
            {job.location || "Not specified"}
            </p>
        </div>

        <div>
            {job.url ? (
            <a
                href={job.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1 text-sm font-medium border border-border px-4 py-2 hover:bg-accent transition-colors"
            >
                Apply Now <ArrowUpRight className="size-4" />
            </a>
            ) : (
            <p className="text-xs text-muted-foreground">
                No apply link available
            </p>
            )}
        </div>
        </div>
    </div>
    </>
)
}
