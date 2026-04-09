import { useGetSingleJob } from "@/hooks/queries/postjob"
import { Spinner } from "../ui/spinner"
import { Link, useParams } from "react-router"
import { ArrowRight } from "lucide-react"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer"
import ApplicationDrawer from "../user/ApplicationDrawer"
import { useState } from "react"
import { Badge } from "../ui/badge"

const JobsPreview = () => {
    const { jobId } = useParams()
    const { data, isPending, error } = useGetSingleJob(jobId)
    const [isApplyDrawerOpen, setIsApplyDrawerOpen] = useState(false)
    const alreadyApplied = Boolean(data?.myApplicationStatus)
    const applicationCount = data?.totalApplications ?? 0
   
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
        <section className="h-full min-h-0 overflow-y-auto p-6 flex flex-col space-y-4">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold">{data.roleTitle}</h1>
                <p className="text-muted-foreground">{data.companyName}</p>
                <p className="text-sm text-muted-foreground">
                    {data.location} · {data.employmentType}
                </p>
            </div>

            {data.postedUser?.role === "USER" && data.url && (
                <div className="flex flex-wrap items-center gap-3">
                    <Link
                        to={data.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center cursor-pointer gap-1.5 px-5 py-2.5 text-sm font-semibold bg-primary text-white rounded-[10px] w-fit transition-all duration-100 active:translate-y-0.75"
                    >
                        Apply <ArrowRight className="size-4" />
                    </Link>
                    {applicationCount > 0 && (
                        <span className="text-xs text-muted-foreground">
                            {applicationCount} {applicationCount === 1 ? "applicant" : "applicants"}
                        </span>
                    )}
                </div>
            )}

            {data.postedUser?.role === "LEAD" && (
                <div className="flex flex-wrap items-center gap-3">
                    {alreadyApplied ? (
                        <Badge variant="default" className="rounded-full px-3 py-1 text-xs font-medium">
                            Applied
                        </Badge>
                    ) : (
                        <Drawer open={isApplyDrawerOpen} onOpenChange={setIsApplyDrawerOpen} direction="top">
                            <DrawerTrigger asChild>
                                <button className="inline-flex items-center cursor-pointer gap-1.5 px-5 py-2.5 font-semibold text-sm bg-primary text-white rounded-[10px] w-fit transition-all duration-100 active:translate-y-0.75">
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

            {data.description && (
                <div
                    key={jobId}
                    className="prose max-w-none pb-6"
                    dangerouslySetInnerHTML={{ __html: data.description }}
                />
            )}
        </section>
    )
}

export default JobsPreview