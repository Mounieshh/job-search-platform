import { useGetSingleJob } from "@/hooks/queries/postjob"
import { Spinner } from "../ui/spinner"
import { Link, useNavigate, useParams } from "react-router"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer"
import ApplicationDrawer from "../user/ApplicationDrawer"
import { useState } from "react"
import { Badge } from "../ui/badge"
import DOMPurify from "dompurify"

const JobsPreview = () => {
    const { jobId } = useParams()
    const navigate = useNavigate()
    const { data, isPending, error } = useGetSingleJob(jobId)
    const [isApplyDrawerOpen, setIsApplyDrawerOpen] = useState(false)
    const alreadyApplied = Boolean(data?.myApplicationStatus)
    const applicationCount = data?.totalApplications ?? 0

    if (!jobId) {
        return (
            <div className="h-full flex items-center justify-center py-20" role="status">
                <p className="text-sm text-muted-foreground">Select a job to view details</p>
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

    const sanitizedDescription = data.description
        ? DOMPurify.sanitize(data.description)
        : null

    return (
        <section className="h-full min-h-0 overflow-y-auto p-6 flex flex-col">
            <button
                onClick={() => navigate("/browseJobs")}
                className="lg:hidden mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                aria-label="Back to job listings"
            >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back to listings
            </button>

            <div>
                <h1 className="text-xl font-semibold text-foreground leading-snug">{data.roleTitle}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{data.companyName}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                    {data.location} · {data.employmentType}
                </p>
            </div>

            {data.postedUser?.role === "USER" && data.url && (
                <div className="mt-5 flex flex-wrap items-center gap-3">
                    <Link
                        to={data.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-lg transition-all duration-150 hover:brightness-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                        Apply <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                    {applicationCount > 0 && (
                        <span className="text-xs text-muted-foreground">
                            {applicationCount} {applicationCount === 1 ? "applicant" : "applicants"}
                        </span>
                    )}
                </div>
            )}

            {data.postedUser?.role === "LEAD" && (
                <div className="mt-5 flex flex-wrap items-center gap-3">
                    {alreadyApplied ? (
                        <Badge variant="default" className="rounded-full px-3 py-1 text-xs font-medium">
                            Applied
                        </Badge>
                    ) : (
                        <Drawer open={isApplyDrawerOpen} onOpenChange={setIsApplyDrawerOpen} direction="top">
                            <DrawerTrigger asChild>
                                <button className="inline-flex items-center gap-1.5 px-5 py-2.5 font-semibold text-sm bg-primary text-primary-foreground rounded-lg transition-all duration-150 hover:brightness-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                                    Easy Apply
                                </button>
                            </DrawerTrigger>
                            <DrawerContent>
                                <DrawerHeader>
                                    <DrawerTitle>Easy Apply</DrawerTitle>
                                    <DrawerDescription>
                                        Upload your resume and optionally share your GitHub profile.
                                    </DrawerDescription>
                                </DrawerHeader>
                                <div className="px-4 pb-6 overflow-y-auto">
                                    <ApplicationDrawer jobId={data.id} onSuccess={() => setIsApplyDrawerOpen(false)} />
                                </div>
                            </DrawerContent>
                        </Drawer>
                    )}
                    <span className="text-xs text-muted-foreground">
                        {applicationCount === 0
                            ? "Be the first to apply"
                            : `${applicationCount} ${applicationCount === 1 ? "applicant" : "applicants"}`}
                    </span>
                </div>
            )}

            {sanitizedDescription && (
                <div
                    key={jobId}
                    className="prose max-w-none mt-8 pb-6"
                    dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                />
            )}
        </section>
    )
}

export default JobsPreview
