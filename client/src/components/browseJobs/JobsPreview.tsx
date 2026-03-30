import { useGetSingleJob } from "@/hooks/queries/postjob"
import { Spinner } from "../ui/spinner"
import { Link, useParams } from "react-router"
import { ArrowRight } from "lucide-react"

const JobsPreview = () => {
    const { jobId } = useParams()
    const { data, isPending, error } = useGetSingleJob(jobId)
   
    if (!jobId) {
        return (
            <div className="h-full flex items-center justify-center text-muted-foreground py-20">
                Select a job to view details
            </div>
        )
    }

    if (isPending) {
        return (
            <div className="h-full flex justify-center items-center py-20">
                <Spinner className="size-7" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-4 text-muted-foreground">Something went wrong</div>
        )
    }

    return (
        <section className="p-6 flex flex-col space-y-4">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold">{data.roleTitle}</h1>
                <p className="text-muted-foreground">{data.companyName}</p>
                <p className="text-sm text-muted-foreground">
                    {data.location} · {data.employmentType}
                </p>
            </div>

            {data.postedUser?.role === "USER" && data.url && (
                <Link
                    to={data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium bg-primary text-white rounded-[10px] w-fit transition-all duration-100 active:translate-y-0.75"
                >
                    Apply <ArrowRight className="size-4" />
                </Link>
            )}

            {data.postedUser?.role === "LEAD" && (
                <Link to="/" className="inline-flex items-center gap-1.5 px-5 py-2.5 font-semibold text-sm bg-primary text-white rounded-[10px] w-fit transition-all duration-100 active:translate-y-0.75">
                    Easy Apply
                </Link>
            )}

            {data.description && (
                <div
                    key={jobId}
                    className="prose max-w-none "
                    dangerouslySetInnerHTML={{ __html: data.description }}
                />
            )}
        </section>
    )
}

export default JobsPreview