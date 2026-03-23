import { Link, useParams } from "react-router"
import { Spinner } from "@/components/ui/spinner"
import { ArrowUpRight, Building2, CalendarClock, Wallet } from "lucide-react"
import { useJobDetails } from "@/hooks/queries/job"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"


export default function JobDetailPage() {
  const { companyName, slugId } = useParams()
  const { data, isPending, error } = useJobDetails(companyName, slugId)

  const postedDate = data
    ? new Date(data.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : ""

  
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
    <div className="relative px-3 py-2 sm:px-6 sm:py-3">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44" />

      <div className="relative max-w-6xl mx-auto space-y-4">
      <Link
        to="/joblistings"
        className="inline-flex text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back to Jobs
      </Link>

      <section className="border border-border bg-card/90 backdrop-blur-sm p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
          <Building2 className="size-3.5" />
          <span>{data.companyName || "Company"}</span>
          <span className="text-border">•</span>
          <CalendarClock className="size-3.5" />
          <span>{postedDate}</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-serif text-card-foreground leading-tight">
            {data.title}
          </h1>
          <p className="text-sm text-muted-foreground max-w-3xl">
            {data.summary || "Explore role scope, expectations, and outcomes before applying."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {data.location && <Badge variant="outline">{data.location}</Badge>}
          {data.salary && <Badge variant="outline">{data.salary}</Badge>}
          {data.employmentType && <Badge variant="outline">{data.employmentType}</Badge>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="border border-border bg-background/70 p-3">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Compensation</p>
            <p className="text-sm font-semibold mt-1">{data.salary || "Not disclosed"}</p>
          </div>
          <div className="border border-border bg-background/70 p-3">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Work Location</p>
            <p className="text-sm font-semibold mt-1">{data.location || "Not specified"}</p>
          </div>
          <div className="border border-border bg-background/70 p-3">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Job Type</p>
            <p className="text-sm font-semibold mt-1">{data.employmentType || "Not specified"}</p>
          </div>
          <div className="border border-border bg-background/70 p-3">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Posted</p>
            <p className="text-sm font-semibold mt-1">{postedDate}</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        <div className="space-y-4">
          {data.description && (
            <section id="overview" className="border border-border bg-card p-6 space-y-3">
              <h2 className="text-base font-semibold tracking-tight">Role Overview</h2>
              <p className="text-sm text-card-foreground leading-relaxed whitespace-pre-line">{data.description}</p>
            </section>
          )}

          {(data.requirements?.length > 0 || data.duties?.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.requirements?.length > 0 && (
                <section id="requirements" className="border border-border bg-card p-5 space-y-3">
                  <h2 className="text-base font-semibold tracking-tight">Requirements</h2>
                  <ul className="space-y-2">
                    {data.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-card-foreground">
                        <span className="mt-2 size-1.5 rounded-full bg-muted-foreground shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {data.duties?.length > 0 && (
                <section id="duties" className="border border-border bg-card p-5 space-y-3">
                  <h2 className="text-base font-semibold tracking-tight">Responsibilities</h2>
                  <ul className="space-y-2">
                    {data.duties.map((duty, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-card-foreground">
                        <span className="mt-2 size-1.5 rounded-full bg-muted-foreground shrink-0" />
                        {duty}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}

        </div>

        <aside className="w-full shrink-0 space-y-4 lg:sticky lg:top-20">
          <div className="border border-border bg-card p-5 space-y-5">
            <div>
              <p className="text-xs uppercase text-muted-foreground inline-flex items-center gap-1">
                <Wallet className="size-3.5" /> Salary
              </p>
              <p className="text-base font-semibold text-card-foreground mt-0.5">
                {data.salary || "Not disclosed"}
              </p>
            </div>
          </div>

          <div className="border border-border bg-card p-5">
            {data.url ? (
              <Button asChild className="w-full">
                <a
                  href={data.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1"
                >
                  Apply Now <ArrowUpRight className="size-4" />
                </a>
              </Button>
            ) : (
              <p className="text-xs text-muted-foreground">No apply link available</p>
            )}
          </div>

          <div className="border border-border bg-card p-5 space-y-2 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Navigate Sections</p>
            <div className="flex flex-wrap gap-2">
              <a href="#overview" className="border border-border px-2 py-1 hover:bg-accent transition-colors">Overview</a>
              <a href="#requirements" className="border border-border px-2 py-1 hover:bg-accent transition-colors">Requirements</a>
              <a href="#duties" className="border border-border px-2 py-1 hover:bg-accent transition-colors">Responsibilities</a>
            </div>
          </div>
        </aside>
      </div>
      </div>
    </div>
  )
}