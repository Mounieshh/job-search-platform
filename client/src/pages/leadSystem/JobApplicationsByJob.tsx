import { useLeadJobApplications } from "@/hooks/queries/lead"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { useShortlistTopApplications } from "@/hooks/mutations/lead"
import { Link, useParams, useSearchParams } from "react-router"
import { useMemo, useState } from "react"

const PAGE_SIZE = 10

export default function JobApplicationsByJob() {
    const { jobId } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const { mutateAsync: shortlistTop10, isPending: isShortlisting } = useShortlistTopApplications()
    const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "shortlisted" | "rejected">("all")

    const currentPage = Math.max(1, Number(searchParams.get("page")) || 1)

    const { data, isPending, error } = useLeadJobApplications(jobId, currentPage, PAGE_SIZE)

    const shortlistedCount = data?.stats?.shortlisted ?? 0
    const rejectedCount = data?.stats?.rejected ?? 0
    const pendingCount = data?.stats?.pending ?? 0
    const totalCount = data?.stats?.total ?? 0

    const applications = data?.applications ?? []

    const filteredApplications = useMemo(() => {
        if (statusFilter === "all") {
            return applications
        }

        return applications.filter((application) => (application.status || "").toLowerCase() === statusFilter)
    }, [applications, statusFilter])

    if (!jobId) {
        return (
            <div className="p-4 text-sm text-gray-500 text-center py-20">Job not found</div>
        )
    }

    if (isPending) {
        return (
            <div className="min-h-50 flex justify-center items-center">
                <Spinner className="size-6 text-gray-400" />
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="p-4 text-sm text-gray-500 text-center py-20">Unable to fetch applications for this job</div>
        )
    }

    const totalPages = data.pagination.totalPages
    const hasPrevious = currentPage > 1
    const hasNext = currentPage < totalPages

    const handlePageChange = (nextPage: number) => {
        const params = new URLSearchParams(searchParams)
        params.set("page", String(nextPage))
        setSearchParams(params)
    }

    const handleShortlist = async () => {
        if (!jobId) return
        await shortlistTop10({ jobId })
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6">
            <div>
                <Link to="/lead/posted" className="text-sm text-primary mb-4 inline-flex items-center hover:underline">
                    ← Back to posted jobs
                </Link>
                
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight">{data.job.roleTitle}</h1>
                        <p className="text-sm text-gray-500">
                            {data.job.companyName} &middot; {data.job.location} &middot; {data.job.employmentType}
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
                        <div className="mr-2 flex items-center gap-2 text-xs text-gray-500">
                            <span>Shortlisted: <span className="font-medium text-blue-700">{shortlistedCount}</span></span>
                            <span>Rejected: <span className="font-medium text-red-700">{rejectedCount}</span></span>
                        </div>
                        <Button 
                            onClick={handleShortlist} 
                            disabled={isShortlisting || totalCount === 0}
                            className="bg-amber-500 hover:bg-amber-600 text-white shadow-none"
                            size="sm"
                        >
                            {isShortlisting ? "Shortlisting..." : "Shortlist with AI ✦"}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 flex flex-col justify-center bg-white shadow-sm">
                    <span className="text-xs text-gray-500 font-mono tracking-wider uppercase mb-1">Total</span>
                    <span className="font-mono text-xl font-bold">{totalCount}</span>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 flex flex-col justify-center bg-white shadow-sm">
                    <span className="text-xs text-gray-500 font-mono tracking-wider uppercase mb-1">Shortlisted</span>
                    <span className="font-mono text-xl font-bold text-blue-600">{shortlistedCount}</span>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 flex flex-col justify-center bg-white shadow-sm">
                    <span className="text-xs text-gray-500 font-mono tracking-wider uppercase mb-1">Rejected</span>
                    <span className="font-mono text-xl font-bold text-red-600">{rejectedCount}</span>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    onClick={() => setStatusFilter("all")}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${statusFilter === "all" ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                >
                    All ({totalCount})
                </button>
                <button
                    type="button"
                    onClick={() => setStatusFilter("pending")}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${statusFilter === "pending" ? "border-amber-500 bg-amber-500 text-white" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                >
                    Pending ({pendingCount})
                </button>
                <button
                    type="button"
                    onClick={() => setStatusFilter("shortlisted")}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${statusFilter === "shortlisted" ? "border-blue-600 bg-blue-600 text-white" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                >
                    Shortlisted ({shortlistedCount})
                </button>
                <button
                    type="button"
                    onClick={() => setStatusFilter("rejected")}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${statusFilter === "rejected" ? "border-red-600 bg-red-600 text-white" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                >
                    Rejected ({rejectedCount})
                </button>
            </div>

            {applications.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-10">No applications received for this job.</p>
            ) : (
                <div className="border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
                    {/* Desktop View */}
                    <div className="hidden md:block overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                                    <TableHead className="font-mono text-xs uppercase text-gray-500">Applicant</TableHead>
                                    <TableHead className="font-mono text-xs uppercase text-gray-500">Skills</TableHead>
                                    <TableHead className="font-mono text-xs uppercase text-gray-500">Status</TableHead>
                                    <TableHead className="font-mono text-xs uppercase text-gray-500 text-center">AI Score</TableHead>
                                    <TableHead className="font-mono text-xs uppercase text-gray-500 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredApplications.map((app) => (
                                    <TableRow 
                                        key={app.id}
                                        className={`hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                                            app.status === "shortlisted" ? "bg-blue-50/50 border-l-2 border-l-blue-500" : "border-l-2 border-l-transparent"
                                        }`}
                                    >
                                        <TableCell>
                                            <div className="font-medium text-gray-900">{app.applicant?.name || "N/A"}</div>
                                            <div className="text-xs text-gray-400 mt-1">{app.applicant?.email || "N/A"}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {app.profile?.skills?.slice(0, 3).map((skill, i) => (
                                                    <Badge key={i} variant="secondary" className="bg-gray-100 text-gray-600 font-normal shadow-none px-1.5 py-0">
                                                        {skill}
                                                    </Badge>
                                                )) || <span className="text-xs text-gray-400">-</span>}
                                                {(app.profile?.skills?.length || 0) > 3 && (
                                                    <span className="text-xs text-gray-400">+{app.profile!.skills!.length - 3}</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`rounded-full px-2.5 py-0.5 font-medium text-[10px] uppercase shadow-none border-none ${
                                                app.status === 'shortlisted' ? 'bg-blue-100 text-blue-800' :
                                                app.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                                app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {app.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center font-mono">
                                            {app.aiScore ?? "—"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <a href={app.resume} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                                                    Resume
                                                </a>
                                                <Drawer direction="right">
                                                    <DrawerTrigger asChild>
                                                        <Button size="sm" variant="outline" className="h-7 text-xs shadow-none border-gray-200">Details</Button>
                                                    </DrawerTrigger>
                                                    <DrawerContent className="w-full sm:w-96 rounded-l-xl rounded-r-none h-full right-0 left-auto top-0 mt-0">
                                                        <DrawerHeader className="border-b border-gray-100 pb-4">
                                                            <DrawerTitle className="text-lg font-semibold">{app.applicant?.name || "Applicant Details"}</DrawerTitle>
                                                            <DrawerDescription className="text-sm text-gray-500">
                                                                {app.applicant?.email || "No email"}
                                                            </DrawerDescription>
                                                        </DrawerHeader>
                                                        <div className="p-6 space-y-5 overflow-y-auto">
                                                            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                                                <div>
                                                                    <p className="text-xs font-mono uppercase text-gray-400 mb-1">Status</p>
                                                                    <Badge className={`rounded-full px-2.5 py-0.5 font-medium text-[10px] uppercase shadow-none border-none ${
                                                                        app.status === 'shortlisted' ? 'bg-blue-100 text-blue-800' :
                                                                        app.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                                                        app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                                    }`}>
                                                                        {app.status}
                                                                    </Badge>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-xs font-mono uppercase text-gray-400 mb-1">AI Score</p>
                                                                    <p className="text-lg font-mono font-medium">{app.aiScore ?? "—"}</p>
                                                                </div>
                                                            </div>
                                                            
                                                            <div>
                                                                <p className="text-xs font-mono uppercase text-gray-400 mb-2">Technical Skills</p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {app.profile?.skills?.length ? app.profile.skills.map((s, i) => (
                                                                        <Badge key={i} variant="secondary" className="bg-gray-100 text-gray-700 font-normal">
                                                                            {s}
                                                                        </Badge>
                                                                    )) : <span className="text-sm text-gray-500">No skills listed</span>}
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <p className="text-xs font-mono uppercase text-gray-400 mb-2">Links & Info</p>
                                                                <div className="space-y-3 text-sm">
                                                                    {app.githubLink && (
                                                                        <div className="flex justify-between items-center">
                                                                            <span className="text-gray-500">GitHub</span>
                                                                            <a href={app.githubLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline max-w-50 truncate">
                                                                                {app.githubLink}
                                                                            </a>
                                                                        </div>
                                                                    )}
                                                                    <div className="flex justify-between items-center mt-2">
                                                                        <span className="text-gray-500">Resume</span>
                                                                        <a href={app.resume} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                                                            View Document →
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </DrawerContent>
                                                </Drawer>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden flex flex-col">
                        {filteredApplications.map((app) => (
                            <div key={app.id} className={`p-4 border-b border-gray-100 flex flex-col gap-3 ${app.status === "shortlisted" ? "bg-blue-50/50 border-l-2 border-l-blue-500" : "border-l-2 border-l-transparent"}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium text-gray-900">{app.applicant?.name || "N/A"}</p>
                                        <p className="text-xs text-gray-500">{app.applicant?.email || "N/A"}</p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <Badge className={`rounded-full px-2 py-0.5 font-medium text-[10px] uppercase shadow-none border-none ${
                                            app.status === 'shortlisted' ? 'bg-blue-100 text-blue-800' :
                                            app.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                            app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {app.status}
                                        </Badge>
                                        <div className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-mono">
                                            {app.aiScore ?? "—"}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {app.profile?.skills?.slice(0, 3).map((skill, i) => (
                                        <Badge key={i} variant="secondary" className="bg-gray-100 text-gray-600 font-normal shadow-none px-1.5 py-0 text-[10px]">
                                            {skill}
                                        </Badge>
                                    )) || <span className="text-xs text-gray-400">-</span>}
                                    {(app.profile?.skills?.length || 0) > 3 && (
                                        <span className="text-[10px] text-gray-500">+{app.profile!.skills!.length - 3} more</span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center pt-2 mt-1 border-t border-gray-50">
                                    <a href={app.resume} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                                        View Resume
                                    </a>
                                    <Drawer direction="right">
                                        <DrawerTrigger asChild>
                                            <Button size="sm" variant="outline" className="h-7 text-xs shadow-none border-gray-200">Details</Button>
                                        </DrawerTrigger>
                                        {/* Same drawer content as desktop */}
                                        <DrawerContent className="w-4/5 rounded-l-xl rounded-r-none h-full right-0 left-auto top-0 mt-0">
                                            <DrawerHeader className="border-b border-gray-100 pb-4">
                                                <DrawerTitle className="text-lg font-semibold">{app.applicant?.name || "Applicant Details"}</DrawerTitle>
                                                <DrawerDescription className="text-sm text-gray-500">
                                                    {app.applicant?.email || "No email"}
                                                </DrawerDescription>
                                            </DrawerHeader>
                                            <div className="p-4 space-y-5 overflow-y-auto">
                                                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                                    <div>
                                                        <p className="text-xs font-mono uppercase text-gray-400 mb-1">Status</p>
                                                        <Badge className={`rounded-full px-2.5 py-0.5 font-medium text-[10px] uppercase shadow-none border-none ${
                                                            app.status === 'shortlisted' ? 'bg-blue-100 text-blue-800' :
                                                            app.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                                            app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {app.status}
                                                        </Badge>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs font-mono uppercase text-gray-400 mb-1">AI Score</p>
                                                        <p className="text-lg font-mono font-medium">{app.aiScore ?? "—"}</p>
                                                    </div>
                                                </div>
                                                
                                                <div>
                                                    <p className="text-xs font-mono uppercase text-gray-400 mb-2">Technical Skills</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {app.profile?.skills?.length ? app.profile.skills.map((s, i) => (
                                                            <Badge key={i} variant="secondary" className="bg-gray-100 text-gray-700 font-normal">
                                                                {s}
                                                            </Badge>
                                                        )) : <span className="text-sm text-gray-500">No skills listed</span>}
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="text-xs font-mono uppercase text-gray-400 mb-2">Links & Info</p>
                                                    <div className="space-y-3 text-sm">
                                                        {app.githubLink && (
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-gray-500">GitHub</span>
                                                                <a href={app.githubLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline max-w-50 truncate">
                                                                    Link
                                                                </a>
                                                            </div>
                                                        )}
                                                        <div className="flex justify-between items-center mt-2">
                                                            <span className="text-gray-500">Resume</span>
                                                            <a href={app.resume} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                                                View →
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </DrawerContent>
                                    </Drawer>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {applications.length > 0 && filteredApplications.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">No applications match this filter on the current page.</p>
            )}

            <div className="flex items-center justify-between gap-4 pt-2">
                <p className="text-xs text-gray-500">
                    Page <span className="font-medium text-gray-900">{data.pagination.page}</span> of {data.pagination.totalPages} <span className="mx-1">&middot;</span> Total {data.pagination.total}
                </p>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={!hasPrevious} className="h-8 text-xs shadow-none">
                        Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={!hasNext} className="h-8 text-xs shadow-none">
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
