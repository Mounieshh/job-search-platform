import { useAdminSingleJob } from "@/hooks/queries/admin"
import { useGetJobApprovalInfo } from "@/hooks/queries/lead"
import { Spinner } from "../ui/spinner"
import { Link, useParams } from "react-router"
import { ArrowRight } from "lucide-react"
import StatusBadge from "../shared/StatusBadge"

const AdminApprovedReview = () => {
    const { jobId } = useParams()
    const { data, isPending, error } = useAdminSingleJob(jobId)
    const { data: approvalInfo } = useGetJobApprovalInfo(jobId)

    if (!jobId) {
        return (
            <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">
                Select a job to view details
            </div>
        )
    }

    if (isPending) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <Spinner className="size-7" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-4 text-muted-foreground text-sm">Something went wrong</div>
        )
    }

    return (
        <section key={jobId} className="p-6 flex flex-col space-y-5 overflow-y-auto h-screen">

            <section>
              <section>

                <div className="flex flex-col space-y-1">
                    <h2 className="font-semibold italic text-base text-muted-foreground">{data.companyName}</h2>
                    <h1 className="font-bold text-2xl">{data.roleTitle}</h1>
                    <p className="text-sm text-muted-foreground">{data.location} · {data.employmentType}</p>
                </div>

                {data.url && (
                    <Link
                        to={data.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-white rounded-[10px] w-fit transition-all duration-100 active:translate-y-0.75"
                        style={{
                            backgroundColor: 'hsl(var(--primary))',
                            boxShadow: '0 4px 0 hsl(var(--primary) / 0.5)'
                        }}
                    >
                        Apply <ArrowRight className="size-4" />
                    </Link>
                )}
              </section>
              <section>
                {approvalInfo && (
                    <div className="flex flex-row gap-20 mt-5">

                        <div>
                          <p className="text-md tracking-wide capitalize italic font-semibold">{approvalInfo.action} by</p>
                          <p className="text-sm font-medium mt-1"><span className="italic font-semibold">{approvalInfo.leadName}</span> from <span className="italic">{data.companyName}</span></p>
                        </div>
                        <div className="flex flex-col space-y-2">

                          <p className={`text-sm capitalize font-medium `}>
                              <StatusBadge status={approvalInfo.action}/>
                          </p>
                          {approvalInfo.reason && (
                              <p className="text-xs text-muted-foreground mt-1">
                                  Reason: {approvalInfo.reason}
                              </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                              {new Date(approvalInfo.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                    </div>
                )}
              </section>
            </section>

            {data.description && (
                <div
                    className="prose max-w-none border rounded-lg p-5"
                    dangerouslySetInnerHTML={{ __html: data.description }}
                />
            )}

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 border-t pt-5">
                <div className="flex flex-col gap-1">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">Posted by</p>
                    {data.user ? (
                        <div className="flex items-center gap-3 mt-1">
                            
                            <div>
                                <p className="text-sm font-medium">{data.user.name}</p>
                                <p className="text-xs text-muted-foreground">{data.user.email}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">Unknown user</p>
                    )}
                </div>
            </div>

        </section>
    )
}

export default AdminApprovedReview