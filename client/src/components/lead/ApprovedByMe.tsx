
import { Link } from 'react-router'
import { Spinner } from '../ui/spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

import { useLeadApprovedJobs} from '@/hooks/queries/lead/useLeadApprovedJobs'


const ApprovedByMe = () => {

  const {data, error, isPending } = useLeadApprovedJobs()

  function toSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
  } 

  if (isPending) {
    return (
      <div className="min-h-screen flex justify-center pt-10">
        <Spinner className="size-7"/>
      </div>
    )
  }

  if(error){
    return (
      <div>
        No Jobs Approved
      </div>
    )
  }

  return (
    <div className="px-3 py-4 sm:px-6 sm:py-6">
      {data.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">No approved or rejected jobs found</p>
      ) : (
        <Table className="w-full min-w-175 border-t-2">
          <TableHeader>
            <TableRow>
              <TableHead>Sno</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Job Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((job, index) => (
              <TableRow key={job.id}>
                <TableCell>{String(index + 1).padStart(2, "0")}</TableCell>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.companyName}</TableCell>
                <TableCell>
                  <Badge className={`rounded-none w-20 ${job.status === "approved" ? "bg-green-700 text-white" : "bg-orange-500 text-white"} uppercase font-semibold`}>
                    {job.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Link to={`/lead/${encodeURIComponent(job.companyName || "company")}/${encodeURIComponent(toSlug(job.title))}`}>
                    <Button className="rounded-none cursor-pointer" variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

export default ApprovedByMe