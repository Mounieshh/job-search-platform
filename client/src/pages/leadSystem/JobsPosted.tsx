import { useLeadPostedApplications } from "@/hooks/queries/lead"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import { Link } from "react-router"
import { ArrowRight } from "lucide-react"

export default function JobsPosted() {
    const { data, isPending, error } = useLeadPostedApplications()

    if (isPending) {
        return (
            <div className="min-h-50 flex justify-center items-center">
                <Spinner className="size-6 text-gray-400" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-4 text-sm text-gray-500 text-center py-10">
                Unable to fetch your posted jobs and applications
            </div>
        )
    }

    return (
        <div className="space-y-4 max-w-4xl mx-auto p-4 sm:p-6">
            <h1 className="text-xl font-semibold tracking-tight">Your posted jobs</h1>

            {!data || data.length === 0 ? (
                <p className="text-sm text-gray-500 py-20 text-center">You have not posted any jobs yet.</p>
            ) : (
                <div className="flex flex-col">
                    {data.map((job) => (
                        <div key={job.id} className="flex justify-between items-center py-4 border-b border-gray-100">
                            <div>
                                <p className="text-sm font-medium text-gray-900">{job.roleTitle}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {job.companyName} &middot; {job.location} &middot; {job.employmentType}
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-4">
                                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 rounded-full font-medium text-[10px] uppercase shadow-none border-none">
                                    {job.applicationsCount} Applications
                                </Badge>
                                <Link
                                    to={`/lead/posted/${job.id}/applications`}
                                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline transition-colors"
                                >
                                    Manage <ArrowRight className="size-3" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}