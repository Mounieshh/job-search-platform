import { Spinner } from "@/components/ui/spinner"
import { useLeadPostedJobs } from "@/hooks/queries/lead"

export default function JobsPosted() {

    const { data, isPending, error } = useLeadPostedJobs()

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
                Unable to fetch the jobs
            </div>
        )
    }

  return (
    <section>
        {data.length === 0 ? (
            <div>
                No data to show
            </div>
        ): (
            <section>
                {data.map((job) => (
                    <div className="border border-border bg-card p-5 w-1/3 mb-2">
                        <h2>
                            {job.roleTitle}
                        </h2>
                        <h3>
                            {job.companyName}
                        </h3>
                        <h4>
                            {job.location}
                        </h4>
                    </div>
                ))}
            </section>
        )}
    </section>
  )
}
