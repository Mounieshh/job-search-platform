import { useEffect, useState } from "react"
import { Link, useParams, useNavigate } from "react-router"
import { Spinner } from "@/components/ui/spinner"
import { ArrowUpRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { baseUrl } from "@/lib/base"

type User = {
  _id: string
  name: string
  email: string
  emailDomain: string
  userType: string
  role: string
}

type JobDetail = {
  id: string
  title: string
  summary?: string | null
  description?: string | null
  companyName?: string | null
  location?: string | null
  salary?: string | null
  url?: string | null
  employmentType?: string | null
  source: string
  status: string
  createdAt: string
  rejectedReason?: string | null
  postedBy: string
  requirements: string[]
  duties: string[]
  user: User | null
}

export default function JobDetailAdmin() {
  const { companyName, slugId } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState<JobDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

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
          `${baseUrl}/api/jobs/admin/${companyName}/${slugId}`,
          { method: "GET", credentials: "include" }
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

  const handleApprove = async () => {
    if (!job) return
    try {
      setActionLoading(true)
      const response = await fetch(`${baseUrl}/api/jobs/admin/approve/${job.id}`, {
        method: "PATCH",
        credentials: "include"
      })
      if (!response.ok) throw new Error("Failed to approve job")
      navigate("/newrequest")
    } catch (error: any) {
      setError(error.message || "Failed to approve job")
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!job) return
    const reason = rejectReason.trim()
    if (!reason) return
    try {
      setActionLoading(true)
      const response = await fetch(`${baseUrl}/api/jobs/admin/reject/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reason })
      })
      if (!response.ok) throw new Error("Failed to reject job")
      navigate("/newrequest")
    } catch (error: any) {
      setError(error.message || "Failed to reject job")
    } finally {
      setActionLoading(false)
      setRejectDialogOpen(false)
      setRejectReason("")
    }
  }

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

  if (!job) return null

  const isPending = job.status === "pending"
  const isRejected = job.status === "rejected"
  const backLink = isPending ? "/newrequest" : "/approved"

  return (
    <>
      <div className="px-3 pt-4 sm:px-6 sm:pt-6">
        <Link
          to={backLink}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          {isPending ? "Back to Pending Jobs" : "Back to Approved / Rejected Jobs"}
        </Link>
      </div>

      <div className="px-3 py-4 sm:px-6 sm:py-6 max-w-6xl mx-auto space-y-6">

        <div className="border border-border bg-card p-6 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              {job.companyName}
            </p>
            <h1 className="text-2xl font-bold text-card-foreground mt-1">{job.title}</h1>
            <div className="flex flex-wrap gap-2 mt-3">
              {job.location && (
                <span className="text-xs border border-border px-2 py-0.5 text-muted-foreground">
                  {job.location}
                </span>
              )}
              {job.salary && (
                <span className="text-xs border border-border px-2 py-0.5 text-muted-foreground">
                  {job.salary}
                </span>
              )}
              {job.employmentType && (
                <span className="text-xs border border-border px-2 py-0.5 text-muted-foreground">
                  {job.employmentType}
                </span>
              )}
              <span className="text-xs border border-border px-2 py-0.5 text-muted-foreground capitalize">
                {job.source}
              </span>
            </div>
          </div>
          <Badge
            variant={isPending ? "outline" : isRejected ? "destructive" : "secondary"}
            className="uppercase font-semibold text-xs"
          >
            {job.status}
          </Badge>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-1 space-y-4">

            {isRejected && job.rejectedReason && (
              <div className="border border-destructive bg-destructive/10 p-4 space-y-1">
                <p className="text-xs uppercase text-destructive font-semibold tracking-wide">Rejection Reason</p>
                <p className="text-sm text-destructive">{job.rejectedReason}</p>
              </div>
            )}

            {job.description && (
              <div className="border border-border bg-card p-5 space-y-2">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Description</p>
                <p className="text-sm text-card-foreground leading-relaxed whitespace-pre-line">{job.description}</p>
              </div>
            )}

            {job.requirements?.length > 0 && (
              <div className="border border-border bg-card p-5 space-y-3">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Requirements</p>
                <ul className="space-y-2">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-card-foreground">
                      <span className="mt-2 size-1.5 rounded-full bg-muted-foreground shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.duties?.length > 0 && (
              <div className="border border-border bg-card p-5 space-y-3">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Duties</p>
                <ul className="space-y-2">
                  {job.duties.map((duty, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-card-foreground">
                      <span className="mt-2 size-1.5 rounded-full bg-muted-foreground shrink-0" />
                      {duty}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border border-border bg-card p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Source</p>
                  <p className="text-sm text-card-foreground capitalize mt-0.5">{job.source}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Posted On</p>
                  <p className="text-sm text-card-foreground mt-0.5">
                    {new Date(job.createdAt).toLocaleDateString("en-US", {
                      year: "numeric", month: "short", day: "numeric"
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-72 space-y-4 shrink-0">

            <div className="border border-border bg-card p-5 space-y-3">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Job Link</p>
              {job.url ? (
                <a
                  href={job.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1 text-sm font-medium border border-border px-4 py-2 hover:bg-accent transition-colors w-full"
                >
                  Apply Link <ArrowUpRight className="size-4" />
                </a>
              ) : (
                <p className="text-xs text-muted-foreground">No apply link provided</p>
              )}
            </div>

            <div className="border border-border bg-card p-5 space-y-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Posted By</p>
              {job.user ? (
                <div className="space-y-3">
                  {[
                    { label: "Name",      value: job.user.name },
                    { label: "Email",     value: job.user.email },
                    { label: "Domain",    value: job.user.emailDomain },
                    { label: "User Type", value: job.user.userType },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs uppercase text-muted-foreground">{label}</p>
                      <p className="text-sm text-card-foreground mt-0.5 break-all">{value || "—"}</p>
                    </div>
                  ))}
                  <div>
                    <p className="text-xs uppercase text-muted-foreground mb-1">Role</p>
                    <Badge variant="outline" className="rounded-none text-xs">{job.user.role}</Badge>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">User info not available</p>
              )}
            </div>

            {isPending && (
              <div className="border border-border bg-card p-5 space-y-2">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3">Actions</p>
                <Button
                  type="button"
                  variant="default"
                  className="w-full rounded-none cursor-pointer"
                  onClick={handleApprove}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Approving..." : "Approve Job"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-none cursor-pointer"
                  onClick={() => { setRejectReason(""); setRejectDialogOpen(true) }}
                  disabled={actionLoading}
                >
                  Reject Job
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent showCloseButton={false} className="rounded-none">
          <DialogHeader>
            <DialogTitle>Reject Job</DialogTitle>
            <DialogDescription>
              Add a short reason for rejection. This will be saved with the job.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reject-reason">Reason</Label>
            <Textarea
              id="reject-reason"
              placeholder="Write rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="rounded-none"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              className="rounded-none cursor-pointer"
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={!rejectReason.trim() || actionLoading}
              onClick={handleReject}
              className="rounded-none cursor-pointer"
            >
              {actionLoading ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}