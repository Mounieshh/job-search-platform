import { useAdminPendingJobs } from "@/hooks/queries/admin"
import { Spinner } from "../ui/spinner"

const AdminRequestFeed = () => {

    const { data, isPending, error } = useAdminPendingJobs()

    if(isPending){
        return (
            <div className="min-h-screen flex justify-center">
                <Spinner className="size-7"/>
            </div>
        )
    }

    if(error){
        return (
            <div>
                Something went wrong
            </div>
        )
    }

  return (
        <section>
            {data.length === 0 ? (
                <section>
                    No pending jobs to approve
                </section>
            ): (
                <section>
                    {data.map((job) => (
                        <div key={job.id}>
                            <h2>
                                {job.roleTitle}
                            </h2>

                            <h2>
                                {job.companyName}
                            </h2>
                        </div>
                    ))}
                </section>
            )}
        </section>
  )
}

export default AdminRequestFeed