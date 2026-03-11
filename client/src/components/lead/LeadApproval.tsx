import { useEffect, useState } from "react"
import type { Job } from "../JobList"
import { Spinner } from "../ui/spinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Link } from "react-router"

const LeadApproval = () => {

  const [pendingJobs, setPendingJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchPendingJob = async () => {
      try {
        setLoading(true)
        const response = await fetch("http://localhost:5000/api/lead/requests", {
          method: "GET",
          credentials: "include"
        })
  
        if(!response.ok){
          throw new Error("Failed to fetch")
        }
  
        const data = await response.json()
  
        setPendingJobs(data.pendingJob || [])
      } catch (error: any) {
          console.error(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPendingJob()
  }, [])

  if(loading){
        return  (
            <div className="min-h-screen flex justify-center pt-10">
                <Spinner className="size-7"/>
            </div>
        )
    }

    function toSlug(title: string): string {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
    }

  return (
    <div className="px-3 py-4 sm:px-6 sm:py-6">
            <div className="border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <div>
                        <h2 className="text-base font-semibold text-card-foreground">Pending Job Approvals</h2>
                        <p className="text-sm text-muted-foreground">Review and approve submitted jobs</p>
                    </div>
                    <Badge variant="secondary" className="rounded-none">{pendingJobs.length}</Badge>
                </div>

            <Table className="w-full min-w-245">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Sno</TableHead>
                            <TableHead>Job Title</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>PostedBy</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Job Details</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                    {pendingJobs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="py-8 text-center text-sm text-muted-foreground">
                                    No pending jobs to review
                                </TableCell>
                            </TableRow>
                    ) : pendingJobs.map((pending, index) => (
                            <TableRow key={pending.id}>
                                <TableCell>
                                    {String(index + 1).padStart(2, "0")}
                                </TableCell>
                                <TableCell className="font-medium text-card-foreground">{pending.title}</TableCell>
                                <TableCell className="text-muted-foreground">{pending.companyName}</TableCell>
                                <TableCell className="text-muted-foreground">{pending.user?.email || "N/A"}</TableCell>
                                <TableCell className="text-muted-foreground">{pending.user?.role || "N/A"}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="rounded-none bg-gray-800 text-white uppercase font-semibold">{pending.status}</Badge>
                                </TableCell>
                                <TableCell>
                                    <Link to={`/admin/jobs/${encodeURIComponent(pending.companyName || "company")}/${encodeURIComponent(toSlug(pending.title))}`}>
                                        <Button className="rounded-none cursor-pointer" variant="outline">
                                            View Details
                                        </Button>
                                    </Link>
                                </TableCell>
                                <TableCell className="flex flex-row gap-1 whitespace-nowrap">
                                    <Button type="button" variant="outline" size="sm" className="cursor-pointer rounded-none w-20">
                                        Approve
                                    </Button>
                                    <Button type="button" variant="outline" size="sm" className="cursor-pointer rounded-none w-20">
                                        Reject
                                    </Button>
                                </TableCell>
                                
                            </TableRow>
                    ))}
                    </TableBody>
            </Table>
            </div>
    </div>
  )
}

export default LeadApproval