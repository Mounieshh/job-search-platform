import { useAdminLeadRequests } from "@/hooks/queries/admin"
import { useAdminReviewLeadRequest } from "@/hooks/mutations/admin"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useMemo, useState } from "react"
import { Check, X, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"

type LeadReq = LeadRequest & { _id: string }
type StatusFilter = "all" | "pending" | "approved" | "rejected"
type SortKey = "name"| "email" | "company" | "position" | "date"
type SortDir = "asc" | "desc"

const PAGE_SIZE_OPTIONS = [10, 20, 50]

const STATUS_LABELS: Record<StatusFilter, string> = {
  all: "All statuses",
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
}

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <ArrowUpDown className="ml-1.5 inline size-3.5 text-muted-foreground/50" aria-hidden="true" />
  return sortDir === "asc"
    ? <ArrowUp className="ml-1.5 inline size-3.5 text-primary" aria-hidden="true" />
    : <ArrowDown className="ml-1.5 inline size-3.5 text-primary" aria-hidden="true" />
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "approved" ? "bg-primary/10 text-primary border-primary/20" :
    status === "rejected" ? "bg-destructive/10 text-destructive border-destructive/20" :
    "bg-muted text-muted-foreground border-border"
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${cls}`}>
      {status}
    </span>
  )
}

export default function AdminLeadRequestsPage() {
  const { data: requests, isLoading } = useAdminLeadRequests()
  const { mutate: reviewRequest, isPending: isReviewing } = useAdminReviewLeadRequest()

  const [comments, setComments] = useState<Record<string, string>>({})
  const [dialog, setDialog] = useState<{ request: LeadReq | null; action: "approve" | "reject" | null }>({
    request: null, action: null,
  })

  const [searchText, setSearchText] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [sortKey, setSortKey] = useState<SortKey>("date")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const allRequests = (requests ?? []) as LeadReq[]

  const toggleSort = (col: SortKey) => {
    if (sortKey === col) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortKey(col); setSortDir("asc") }
    setPage(1)
  }

  const filtered = useMemo(() => {
    const q = searchText.trim().toLowerCase()
    return allRequests.filter(r => {
      const matchesSearch = !q || [r.userId?.name, r.companyName, r.companyEmail, r.position]
        .join(" ").toLowerCase().includes(q)
      const matchesStatus = statusFilter === "all" || r.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [allRequests, searchText, statusFilter])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortKey === "date") {
        const av = new Date(a.createdAt).getTime()
        const bv = new Date(b.createdAt).getTime()
        return sortDir === "asc" ? av - bv : bv - av
      }
      const map: Record<SortKey, string> = {
        name: a.userId?.name ?? "",
        email: a.userId?.email ?? "",
        company: a.companyName,
        position: a.position,
        date: "",
      }
      const bmap: Record<SortKey, string> = {
        name: b.userId?.name ?? "",
        email: a.userId?.email ?? "",
        company: b.companyName,
        position: b.position,
        date: "",
      }
      const av = map[sortKey].toLowerCase()
      const bv = bmap[sortKey].toLowerCase()
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av)
    })
  }, [filtered, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize)

  const handleSearch = (v: string) => { setSearchText(v); setPage(1) }
  const handleStatus = (v: string) => { setStatusFilter(v as StatusFilter); setPage(1) }
  const handlePageSize = (v: string) => { setPageSize(Number(v)); setPage(1) }

  const pageNumbers = useMemo(() => {
    const pages: (number | "ellipsis")[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (page > 3) pages.push("ellipsis")
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
      if (page < totalPages - 2) pages.push("ellipsis")
      pages.push(totalPages)
    }
    return pages
  }, [page, totalPages])

  const submitReview = () => {
    if (!dialog.request || !dialog.action) return
    reviewRequest(
      { requestId: dialog.request._id, action: dialog.action, adminComment: comments[dialog.request._id] ?? "" },
      { onSettled: () => setDialog({ request: null, action: null }) }
    )
  }

  if (isLoading) return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner className="size-6 text-muted-foreground" />
    </div>
  )

  const cols: { key: SortKey; label: string }[] = [
    { key: "name", label: "Applicant" },
    { key: "email", label: "Email"},
    { key: "company", label: "Company" },
    { key: "position", label: "Role" },
    { key: "date", label: "Submitted" },
  ]

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Lead requests</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {filtered.length} of {allRequests.length} request{allRequests.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select value={statusFilter} onValueChange={handleStatus}>
            <SelectTrigger size="sm" className="h-9 w-40 text-sm">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(STATUS_LABELS) as StatusFilter[]).map(s => (
                <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative w-full max-w-xs">
            <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              value={searchText}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search requests…"
              aria-label="Search lead requests"
              className="pl-9 h-9"
            />
          </div>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-md border border-dashed border-border/60 bg-card py-14 text-center text-sm text-muted-foreground">
          {searchText || statusFilter !== "all"
            ? "No requests match your filters."
            : "No lead requests yet."}
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-md border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  {cols.map(({ key, label }) => (
                    <TableHead key={key} scope="col" className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleSort(key)}
                        className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={`Sort by ${label}`}
                      >
                        {label}
                        <SortIcon col={key} sortKey={sortKey} sortDir={sortDir} />
                      </button>
                    </TableHead>
                  ))}
                  <TableHead scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Work email
                  </TableHead>
                  <TableHead scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map(request => (
                  <TableRow key={request._id}>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="font-medium text-foreground text-sm">{request.userId?.name ?? "—"}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="text-xs text-muted-foreground">{request.userId?.email ?? ""}</p>
                        </div>
                      </div>
                    </TableCell>

                    
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-foreground">{request.companyName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-muted-foreground">{request.position}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                      {new Date(request.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-muted-foreground">{request.companyEmail}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <StatusBadge status={request.status} />
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {request.status === "pending" ? (
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-destructive/30 text-destructive hover:bg-destructive/5 gap-1"
                            aria-label={`Reject request from ${request.userId?.name}`}
                            onClick={() => setDialog({ request, action: "reject" })}
                            disabled={isReviewing}
                          >
                            <X aria-hidden="true" className="size-3.5" /> Reject
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            className="gap-1"
                            aria-label={`Approve request from ${request.userId?.name}`}
                            onClick={() => setDialog({ request, action: "approve" })}
                            disabled={isReviewing}
                          >
                            <Check aria-hidden="true" className="size-3.5" /> Approve
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground text-right block">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Rows per page</span>
              <Select value={String(pageSize)} onValueChange={handlePageSize}>
                <SelectTrigger size="sm" className="w-16 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map(n => (
                    <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>
                {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} of {sorted.length}
              </span>
            </div>

            {totalPages > 1 && (
              <Pagination className="mx-0 w-auto justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      aria-disabled={page === 1}
                      className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {pageNumbers.map((n, i) =>
                    n === "ellipsis" ? (
                      <PaginationItem key={`e-${i}`}><PaginationEllipsis /></PaginationItem>
                    ) : (
                      <PaginationItem key={n}>
                        <PaginationLink isActive={n === page} onClick={() => setPage(n)} className="cursor-pointer">
                          {n}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      aria-disabled={page === totalPages}
                      className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </>
      )}

      <Dialog open={!!dialog.request && !!dialog.action} onOpenChange={() => setDialog({ request: null, action: null })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialog.action === "approve" ? "Approve lead request" : "Reject lead request"}
            </DialogTitle>
            <DialogDescription>
              {dialog.request && (
                <>
                  <span className="font-medium">{dialog.request.userId?.name}</span>
                  {" → "}
                  <span className="text-primary">{dialog.request.companyName}</span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {dialog.request?.message && (
            <div className="rounded-md border border-border bg-muted/30 p-3 text-sm">
              <p className="text-xs font-medium uppercase text-muted-foreground mb-1">Applicant message</p>
              <p>{dialog.request.message}</p>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Admin note
            </label>
            <Textarea
              className="min-h-22"
              placeholder={dialog.action === "reject" ? "Reason for rejection (recommended)" : "Optional message to the applicant"}
              value={dialog.request ? comments[dialog.request._id] ?? "" : ""}
              onChange={e =>
                dialog.request && setComments(c => ({ ...c, [dialog.request!._id]: e.target.value }))
              }
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setDialog({ request: null, action: null })}>
              Cancel
            </Button>
            <Button
              type="button"
              variant={dialog.action === "reject" ? "destructive" : "default"}
              disabled={isReviewing}
              onClick={submitReview}
            >
              Confirm {dialog.action === "approve" ? "approval" : "rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
