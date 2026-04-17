import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import StatusBadge from "@/components/shared/StatusBadge"
import { useLeadApprovedJobs } from "@/hooks/queries/lead"

const ApprovedByMe = () => {
  const { data, error, isPending } = useLeadApprovedJobs()

  if (isPending) {
    return (
      <div className="min-h-50 flex justify-center items-center">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-sm text-muted-foreground py-10">
        Unable to load reviewed jobs.
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="py-20 text-center space-y-1">
        <p className="text-sm text-muted-foreground">No jobs reviewed yet.</p>
        <p className="text-xs text-muted-foreground/70">Jobs you approve or reject will appear here.</p>
      </div>
    )
  }

  return (
    <div className="px-3 py-4 sm:px-6 sm:py-6 max-w-6xl mx-auto">
      {/* Desktop table */}
      <div className="hidden md:block">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-border hover:bg-transparent">
              <TableHead className="text-xs uppercase tracking-wider text-muted-foreground px-4 py-2 text-left font-semibold">
                Job Title
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-muted-foreground px-4 py-2 text-left font-semibold">
                Company
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-muted-foreground px-4 py-2 text-left font-semibold">
                Date Reviewed
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-muted-foreground px-4 py-2 text-right font-semibold">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((job) => (
              <TableRow
                key={job.id}
                className="border-b border-border hover:bg-accent/50 transition-colors"
              >
                <TableCell className="px-4 py-3 font-medium text-foreground">
                  {job.roleTitle}
                </TableCell>
                <TableCell className="px-4 py-3 text-muted-foreground">
                  {job.companyName}
                </TableCell>
                <TableCell className="px-4 py-3 text-muted-foreground">
                  {(job as any).updatedAt
                    ? new Date((job as any).updatedAt).toLocaleDateString()
                    : "—"}
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                  <StatusBadge status={job.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile list */}
      <div className="md:hidden flex flex-col">
        {data.map((job) => (
          <div
            key={job.id}
            className="flex justify-between items-start py-4 border-b border-border"
          >
            <div>
              <p className="font-medium text-sm text-foreground">{job.roleTitle}</p>
              <p className="text-xs text-muted-foreground mt-1">{job.companyName}</p>
            </div>
            <StatusBadge status={job.status} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ApprovedByMe
