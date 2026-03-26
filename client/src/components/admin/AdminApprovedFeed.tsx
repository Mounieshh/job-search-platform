import { useAdminReviewedJobs } from "@/hooks/queries/admin"
import { Spinner } from "../ui/spinner"

const AdminApprovedFeed = () => {

    const { data , isPending, error } = useAdminReviewedJobs()

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
                Sommething went wrong
            </div>
        )
    }

  return (
    <section>
        {data.length === 0 ? (
            <section>
                Nothing to show
            </section>
        ): (
            <section>
                {data.map((job) => (
                    <div key={job.id}>
                        <h3>
                            {job.companyName}
                        </h3>
                    </div>
                ))}
            </section>
        )}
    </section>
  )
}

export default AdminApprovedFeed