import { useEffect, useState } from 'react'
import type { Job } from '../job-list'
import { toast } from 'sonner'
import { Spinner } from '../ui/spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Badge } from '../ui/badge'

const ApprovedCard = () => {
  const [loading, setLoading] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])

  useEffect(() => {
    const getJobs = async () => {
      try {
        setLoading(true)

        const response = await fetch("http://localhost:5000/api/jobs/approved-rejected", {
          method: "GET",
          credentials: "include"
        })

        if (!response.ok) {
          throw new Error("Failed to fetch the approved/rejected jobs")
        }

        const data = await response.json()
        setJobs(data.jobs || [])
      } catch (error: any) {
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }

    getJobs()
  }, []) 

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center pt-10">
        <Spinner className="size-7"/>
      </div>
    )
  }

  return (
    <div className="p-6">
      {jobs.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">No approved or rejected jobs found</p>
      ) : (
        <Table className="w-full border-t-2">
          <TableHeader>
            <TableRow>
              <TableHead>Sno</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job, index) => (
              <TableRow key={job.id}>
                <TableCell>{String(index + 1).padStart(2, "0")}</TableCell>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.companyName}</TableCell>
                <TableCell>
                  <Badge className={`rounded-none w-20 ${job.status === "approved" ? "bg-green-700 text-white" : "bg-orange-500 text-white"} uppercase font-semibold`}>
                    {job.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

export default ApprovedCard