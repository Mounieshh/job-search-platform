import { Link, useParams } from "react-router"
import { Spinner } from "@/components/ui/spinner"
import { ArrowUpRight } from "lucide-react"
import { useJobDetails } from "@/hooks/queries/job/useJobDetails"


export default function JobDetailPage() {
  const { companyName, slugId } = useParams()
  const { data, isPending, error } = useJobDetails(companyName, slugId)

  
  if (isPending) {
    return (
      <div className="min-h-screen flex justify-center pt-10">
        <Spinner className="size-7" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="border border-border bg-card p-6 text-sm text-destructive">
          No Job Details to Show
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-3 py-6 sm:px-6 sm:py-8 space-y-6">
      <Link
        to="/joblistings"
        className="inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back to Jobs
      </Link>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 space-y-4">
          <div className="border border-border bg-card p-6 space-y-3">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                {data.companyName}
              </p>
              <h1 className="text-2xl font-bold text-card-foreground mt-1">
                {data.title}
              </h1>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.location && (
                <span className="text-xs border border-border px-2 py-0.5 text-muted-foreground">
                  {data.location}
                </span>
              )}
              {data.salary && (
                <span className="text-xs border border-border px-2 py-0.5 text-muted-foreground">
                  {data.salary}
                </span>
              )}
              {data.employmentType && (
                <span className="text-xs border border-border px-2 py-0.5 text-muted-foreground">
                  {data.employmentType}
                </span>
              )}
              {data.source && (
                <span className="text-xs border border-border px-2 py-0.5 text-muted-foreground capitalize">
                  {data.source}
                </span>
              )}
            </div>
          </div>

          {data.summary && (
            <div className="border border-border bg-card p-6 space-y-2">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Summary</p>
              <p className="text-sm text-card-foreground leading-relaxed">{data.summary}</p>
            </div>
          )}

          {data.description && (
            <div className="border border-border bg-card p-6 space-y-2">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Description</p>
              <p className="text-sm text-card-foreground leading-relaxed whitespace-pre-line">{data.description}</p>
            </div>
          )}

          {(data.requirements?.length > 0 || data.duties?.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.requirements?.length > 0 && (
                <div className="border border-border bg-card p-5 space-y-3">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Requirements</p>
                  <ul className="space-y-2">
                    {data.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-card-foreground">
                        <span className="mt-2 size-1.5 rounded-full bg-muted-foreground shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {data.duties?.length > 0 && (
                <div className="border border-border bg-card p-5 space-y-3">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Duties</p>
                  <ul className="space-y-2">
                    {data.duties.map((duty, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-card-foreground">
                        <span className="mt-2 size-1.5 rounded-full bg-muted-foreground shrink-0" />
                        {duty}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="w-full lg:w-72 shrink-0 space-y-4">
          <div className="border border-border bg-card p-5 space-y-5">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Salary</p>
              <p className="text-base font-semibold text-card-foreground mt-0.5">
                {data.salary || "Not disclosed"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Location</p>
              <p className="text-sm text-card-foreground mt-0.5">
                {data.location || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Employment Type</p>
              <p className="text-sm text-card-foreground mt-0.5">
                {data.employmentType || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Posted On</p>
              <p className="text-sm text-card-foreground mt-0.5">
                {new Date(data.createdAt).toLocaleDateString("en-US", {
                  year: "numeric", month: "short", day: "numeric"
                })}
              </p>
            </div>
          </div>

          <div className="border border-border bg-card p-5">
            {data.url ? (
              <a
                href={data.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1 text-sm font-medium border border-border px-4 py-2 hover:bg-accent transition-colors w-full"
              >
                Apply Now <ArrowUpRight className="size-4" />
              </a>
            ) : (
              <p className="text-xs text-muted-foreground">No apply link available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}