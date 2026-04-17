import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useLeadApprovedJobs } from "@/hooks/queries/lead"

const ApprovedByMe = () => {
  const { data, error, isPending } = useLeadApprovedJobs()

  if (isPending) {
    return (
      <div className="min-h-50 flex justify-center items-center">
        <Spinner className="size-6 text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-sm text-gray-500 py-10">
        You have not reviewed any jobs yet
      </div>
    )
  }

  return (
    <div className="px-3 py-4 sm:px-6 sm:py-6 max-w-6xl mx-auto">
      {!data || data.length === 0 ? (
        <p className="text-center text-sm text-gray-500 py-20">
          You have not reviewed any jobs yet
        </p>
      ) : (
        <>
          <div className="hidden md:block">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b border-gray-200 hover:bg-transparent">
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground px-4 py-2 text-left font-semibold">
                    Job Title
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground px-4 py-2 text-left font-semibold">
                    Company
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground px-4 py-2 text-left font-semibold">
                    Date Approved
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
                    className="border-b border-gray-100 hover:bg-gray-50/70 transition-colors"
                  >
                    <TableCell className="px-4 py-3 font-medium text-gray-900">
                      {job.roleTitle}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500">
                      {job.companyName}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500">
                      {(job as any).updatedAt
                        ? new Date((job as any).updatedAt).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <Badge
                        className={`rounded-full px-2.5 py-0.5 font-medium text-[10px] ${
                          job.status === "approved"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : job.status === "rejected"
                            ? "bg-red-100 text-red-800 hover:bg-red-100"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        {job.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden flex flex-col">
            {data.map((job) => (
              <div
                key={job.id}
                className="flex justify-between items-start py-4 border-b border-gray-100"
              >
                <div>
                  <p className="font-medium text-sm text-gray-900">
                    {job.roleTitle}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{job.companyName}</p>
                </div>
                <Badge
                  className={`mt-0.5 rounded-full px-2 py-0.5 font-medium text-[10px] ${
                    job.status === "approved"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : job.status === "rejected"
                      ? "bg-red-100 text-red-800 hover:bg-red-100"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  {job.status.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default ApprovedByMe