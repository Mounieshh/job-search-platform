import { Link } from "react-router"
import { useAdminPendingJobs, useAdminReviewedJobs, useAdminLeadRequests, useAdminCompanyDirectory } from "@/hooks/queries/admin"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import {
  Inbox, CheckSquare, Building2,
  MessageSquare, History, ArrowRight, ChevronRight,
} from "lucide-react"


function Stat({ label, value, loading }: { label: string; value: number; loading: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      {loading
        ? <div className="h-7 w-10 animate-pulse rounded bg-muted" />
        : <span className="text-2xl font-semibold tabular-nums text-foreground">{value}</span>
      }
    </div>
  )
}

function NavCard({
  to, icon: Icon, label, description, badge,
}: {
  to: string
  icon: React.ElementType
  label: string
  description: string
  badge?: number
}) {
  return (
    <Link
      to={to}
      className="group flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
    >
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground group-hover:bg-background group-hover:text-foreground transition-colors">
        <Icon className="size-4" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{label}</span>
          {badge != null && badge > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors mt-0.5" />
    </Link>
  )
}


export default function AdminDashboardPage() {
  const { data: pendingJobs, isLoading: loadingPending } = useAdminPendingJobs()
  const { data: reviewedJobs, isLoading: loadingReviewed } = useAdminReviewedJobs()
  const { data: leadRequests, isLoading: loadingLeads } = useAdminLeadRequests()
  const { data: companies, isLoading: loadingCompanies } = useAdminCompanyDirectory()

  const pendingCount = pendingJobs?.length ?? 0
  const reviewedCount = reviewedJobs?.length ?? 0
  const pendingLeadCount = (leadRequests ?? []).filter(r => r.status === "pending").length
  const companyCount = companies?.length ?? 0

  const recentPending = (pendingJobs ?? []).slice(0, 5)
  const recentLeads = (leadRequests ?? []).filter(r => r.status === "pending").slice(0, 5)
  const recentReviewed = (reviewedJobs ?? []).slice(0, 5)

  return (
    <div className="w-full space-y-10">

    
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of platform activity and pending actions.</p>
      </div>


      <div className="flex flex-wrap gap-x-10 gap-y-6 border-b border-border pb-8">
        <Stat label="Pending jobs" value={pendingCount} loading={loadingPending} />
        <Stat label="Reviewed jobs" value={reviewedCount} loading={loadingReviewed} />
        <Stat label="Lead requests" value={pendingLeadCount} loading={loadingLeads} />
        <Stat label="Companies" value={companyCount} loading={loadingCompanies} />
      </div>

 
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Sections</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          <NavCard
            to="/admin/lead-requests"
            icon={Inbox}
            label="Lead requests"
            description="Review and approve lead applications"
            badge={pendingLeadCount}
          />
          <NavCard
            to="/admin/requests"
            icon={Inbox}
            label="Job queue"
            description="Approve or reject pending job posts"
            badge={pendingCount}
          />
          <NavCard
            to="/admin/reviewed"
            icon={CheckSquare}
            label="Reviewed jobs"
            description="History of approved and rejected jobs"
          />
          <NavCard
            to="/admin/community"
            icon={MessageSquare}
            label="Community"
            description="Manage community posts and content"
          />
          <NavCard
            to="/admin/credential-history"
            icon={History}
            label="Credential history"
            description="Track lead promotions and role changes"
          />
          <NavCard
            to="/company"
            icon={Building2}
            label="Companies"
            description="Browse companies and their members"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Pending jobs
            </h2>
            <Link to="/admin/requests" className="text-xs text-primary hover:underline underline-offset-4 inline-flex items-center gap-1">
              View all <ArrowRight aria-hidden="true" className="size-3" />
            </Link>
          </div>

          {loadingPending ? (
            <div className="flex justify-center py-8"><Spinner className="size-5 text-muted-foreground" /></div>
          ) : recentPending.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No pending jobs.</p>
          ) : (
            <ul className="divide-y divide-border" role="list">
              {recentPending.map(job => (
                <li key={job.id}>
                  <Link
                    to={`/admin/requests/${job.id}`}
                    className="flex items-start justify-between gap-3 py-3 hover:text-primary transition-colors group"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {job.roleTitle}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{job.companyName}</p>
                    </div>
                    <Badge variant="secondary" className="shrink-0 text-[10px] uppercase">
                      pending
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Lead requests
            </h2>
            <Link to="/admin/lead-requests" className="text-xs text-primary hover:underline underline-offset-4 inline-flex items-center gap-1">
              View all <ArrowRight aria-hidden="true" className="size-3" />
            </Link>
          </div>

          {loadingLeads ? (
            <div className="flex justify-center py-8"><Spinner className="size-5 text-muted-foreground" /></div>
          ) : recentLeads.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No pending lead requests.</p>
          ) : (
            <ul className="divide-y divide-border" role="list">
              {recentLeads.map(req => (
                <li key={req._id}>
                  <Link
                    to="/admin/lead-requests"
                    className="flex items-start justify-between gap-3 py-3 group"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {req.userId?.name ?? "—"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {req.companyName} · {req.position}
                      </p>
                    </div>
                    <span className="shrink-0 inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase text-muted-foreground">
                      pending
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Recently reviewed
            </h2>
            <Link to="/admin/reviewed" className="text-xs text-primary hover:underline underline-offset-4 inline-flex items-center gap-1">
              View all <ArrowRight aria-hidden="true" className="size-3" />
            </Link>
          </div>

          {loadingReviewed ? (
            <div className="flex justify-center py-8"><Spinner className="size-5 text-muted-foreground" /></div>
          ) : recentReviewed.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No reviewed jobs yet.</p>
          ) : (
            <ul className="divide-y divide-border" role="list">
              {recentReviewed.map(job => {
                const isApproved = job.status === "approved"
                return (
                  <li key={job.id}>
                    <Link
                      to={`/admin/reviewed/${job.id}`}
                      className="flex items-start justify-between gap-3 py-3 group"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {job.roleTitle}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{job.companyName}</p>
                      </div>
                      <span className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                        isApproved ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                      }`}>
                        {job.status}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

      </div>
    </div>
  )
}
