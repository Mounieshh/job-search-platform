import { useEffect, useState } from "react"
import { Spinner } from "../ui/spinner"
import type { Job } from "../job-list"
import { Table, TableCaption, TableHead, TableHeader, TableRow } from "../ui/table"



const ApprovalCard = () => {

    const [pendingJobs, setPendingJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const pendingJobs = async () => {
            try {
                setLoading(true)
                const response = await fetch("http://localhost:5000/api/jobs/admin/pending", {
                    method: "GET",
                    credentials: "include"
                })
    
                if(!response.ok){
                    throw new Error("Failed to fetch Pending jobs")
                }
    
                const data = await response.json()
                setPendingJobs(data.user || data)
            } catch (error: any) {
                console.log(error.message);
            } finally {
                setLoading(false)
            }
        }

        pendingJobs()
    }, [])


    if(loading){
        return (
            <div className="min-h-screen flex justify-center pt-10">
                <Spinner className="size-7"/>
            </div>
        )
    }

  return (
    <div>
        {pendingJobs.map((pending) => (
            <Table>
                <TableCaption>A List of Pending Job Request from the Users to Approve</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Sno</TableHead>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Sno</TableHead>
                        <TableHead>Sno</TableHead>
                        <TableHead>Sno</TableHead>
                    </TableRow>
                </TableHeader>
            </Table>
        ))}
    </div>
  )
}

export default ApprovalCard