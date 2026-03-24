import { Link, useParams } from "react-router"
import { Spinner } from "@/components/ui/spinner"
import { ArrowUpRight, BriefcaseBusiness, Building2, CalendarClock, MapPin } from "lucide-react"
import { useJobDetails } from "@/hooks/queries/job"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useSession } from "@/hooks/queries/auth"


export default function JobDetailPage() {
  const { companyName, slugId } = useParams()
  const { data, isPending, error } = useJobDetails(companyName, slugId)

  const { data: user } = useSession()

  const postedDate = data
    ? new Date(data.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : ""

  
  if (isPending) {
    return (
      <div className="min-h-[40vh] flex justify-center pt-10">
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

  if (!companyName || !slugId) {
    return (
      <div className="p-6">
        <div className="border border-border bg-card p-6 text-sm text-destructive">
          Invalid job detail URL.
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6">
        <div className="border border-border bg-card p-6 text-sm text-destructive">
          No Job Details to Show
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
        <div>
          <Link to="/joblistings" className="text-black/40 uppercase text-sm sm:hidden">
              Back to Jobs
          </Link>
        </div>
      <section className="border border-border bg-card p-5 sm:p-6 space-y-4">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1">
              <Building2 className="size-4" />
              {data.companyName || "Company"}
            </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-card-foreground leading-tight">
            {data.title}
          </h2>

          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-4" />
              {data.location || "Location not specified"}
            </span>
            <span className="text-border">•</span>
            <span className="inline-flex items-center gap-1">
              <CalendarClock className="size-4" />
              Posted {postedDate}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {data.employmentType && (
            <Badge variant="outline" className="rounded-full border-2 px-4 py-2 text-sm capitalize">
              {data.employmentType}
            </Badge>
          )}
        </div>
        
          {user ? (

            <div className="flex flex-wrap gap-3">
              {data.url ? (
                <Link to={data.url} target="_blank" className="inline-flex items-center gap-1 bg-primary text-white rounded-lg px-2 py-1">
                    Apply <ArrowUpRight/>
                </Link>
              ) : (
                <Button disabled>No apply link</Button>
              )}
            </div>
          ): (
            <div>
                <Link to="/auth/login" className="inline-flex items-center gap-1 bg-primary text-white rounded-lg px-2 py-1">
                    Sign In to Apply
                </Link>
            </div>
          )}
      </section>

      {data.summary && (
        <section className="border border-border bg-card p-5 sm:p-6 space-y-2">
          <h3 className="text-base font-semibold">About this job</h3>
          <p className="text-sm text-card-foreground leading-relaxed">{data.summary}</p>
        </section>
      )}

      {data.description && (
        <section className="border border-border bg-card p-5 sm:p-6 space-y-2">
          <h3 className="text-base font-semibold">Job description</h3>
          <p className="text-sm text-card-foreground leading-relaxed whitespace-pre-line">{data.description}</p>
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="border border-border bg-card p-5 sm:p-6">
          <h3 className="text-base font-semibold mb-3 inline-flex items-center gap-2">
            <BriefcaseBusiness className="size-4" />
            Requirements
          </h3>
          {data.requirements?.length ? (
            <ul className="space-y-2">
              {data.requirements.map((item, idx) => (
                <li key={idx} className="text-sm text-card-foreground flex items-start gap-2">
                  <span className="mt-2 size-1.5 rounded-full bg-muted-foreground shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No requirements provided.</p>
          )}
        </section>

        <section className="border border-border bg-card p-5 sm:p-6">
          <h3 className="text-base font-semibold mb-3">Responsibilities</h3>
          {data.duties?.length ? (
            <ul className="space-y-2">
              {data.duties.map((item, idx) => (
                <li key={idx} className="text-sm text-card-foreground flex items-start gap-2">
                  <span className="mt-2 size-1.5 rounded-full bg-muted-foreground shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No responsibilities provided.</p>
          )}
        </section>
      </div>
    </div>
  )
}