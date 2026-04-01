import { useLeadJobApplications } from "@/hooks/queries/lead"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { useShortlistTopApplications } from "@/hooks/mutations/lead"
import { Link, useParams, useSearchParams } from "react-router"
import { useMemo } from "react"
import { ArrowLeft } from "lucide-react"

const PAGE_SIZE = 10

export default function JobApplicationsByJob() {
    const { jobId } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const { mutateAsync: shortlistTop10, isPending: isShortlisting } = useShortlistTopApplications()

    const currentPage = Math.max(1, Number(searchParams.get("page")) || 1)

    const { data, isPending, error } = useLeadJobApplications(jobId, currentPage, PAGE_SIZE)

    const shortlistedCount = useMemo(() => {
        return (data?.applications || []).filter((application) => application.status?.toLowerCase() === "shortlisted").length
    }, [data])

    if (!jobId) {
        return (
            <div className="p-4 text-muted-foreground">Job not found</div>
        )
    }

    if (isPending) {
        return (
            <div className="min-h-screen flex justify-center pt-10">
                <Spinner className="size-7" />
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="p-4 text-muted-foreground">Unable to fetch applications for this job</div>
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
        <div className="space-y-4">
            <div className="rounded-xl bg-card p-4 sm:p-5">
                <Link to="/lead/posted" className="text-sm text-primary underline flex gap-1 items-center">
                   <ArrowLeft className="size-4"/> Back to Jobs
                </Link>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold">{data.job.roleTitle} Applications</h1>
                        <p className="text-sm text-muted-foreground">
                            {data.job.companyName} | {data.job.location} | {data.job.employmentType}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <h2>Shortlisted: {shortlistedCount}</h2>
                        <Button onClick={handleShortlist} disabled={isShortlisting || data.applications.length === 0}>
                            {isShortlisting ? "Shortlisting..." : "Shortlist with AI"}
                        </Button>
                    </div>
                </div>
            </div>

            {data.applications.length === 0 ? (
                <p className="text-sm text-muted-foreground">No applications received for this job.</p>
            ) : (
                <div className="rounded-xl border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>AI Score</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.applications.map((application) => (
                                <TableRow key={application.id}>
                                    <TableCell>{application.applicant?.name || "N/A"}</TableCell>
                                    <TableCell>{application.applicant?.email || "N/A"}</TableCell>
                                    <TableCell>
                                        <Badge className="uppercase">{application.status}</Badge>
                                    </TableCell>
                                    <TableCell>{application.aiScore ?? "-"}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <a
                                                href={application.resume}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary underline"
                                            >
                                                Resume
                                            </a>
                                            <Drawer direction="top">
                                                <DrawerTrigger asChild>
                                                    <Button size="sm" variant="outline">Details</Button>
                                                </DrawerTrigger>
                                                <DrawerContent>
                                                    <DrawerHeader>
                                                        <DrawerTitle>{application.applicant?.name || "Applicant Details"}</DrawerTitle>
                                                        <DrawerDescription>
                                                            {application.applicant?.email || "No email"}
                                                        </DrawerDescription>
                                                    </DrawerHeader>
                                                    <div className="px-4 pb-6 space-y-3 text-sm max-h-[70vh] overflow-y-auto">
                                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                            <div className="rounded-md border p-3">
                                                                <p className="text-muted-foreground">Status</p>
                                                                <p className="font-medium uppercase">{application.status}</p>
                                                            </div>
                                                            <div className="rounded-md border p-3">
                                                                <p className="text-muted-foreground">AI Score</p>
                                                                <p className="font-medium">{application.aiScore ?? "Not scored"}</p>
                                                            </div>
                                                            <div className="rounded-md border p-3">
                                                                <p className="text-muted-foreground">GitHub</p>
                                                                {application.githubLink ? (
                                                                    <a href={application.githubLink} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                                                                        {application.githubLink}
                                                                    </a>
                                                                ) : (
                                                                    <p className="font-medium">Not provided</p>
                                                                )}
                                                            </div>
                                                            <div className="rounded-md border p-3">
                                                                <p className="text-muted-foreground">Resume</p>
                                                                <a href={application.resume} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                                                                    Open resume
                                                                </a>
                                                            </div>
                                                        </div>

                                                        <div className="rounded-md border p-3">
                                                            <p className="text-muted-foreground">Skills</p>
                                                            <p className="font-medium">{application.profile?.skills?.length ? application.profile.skills.join(", ") : "No skills listed"}</p>
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
            )}

            <div className="flex items-center justify-between gap-4 pt-2">
                <p className="text-sm text-muted-foreground">
                    Page {data.pagination.page} of {data.pagination.totalPages} | Total {data.pagination.total}
                </p>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => handlePageChange(currentPage - 1)} disabled={!hasPrevious}>
                        Previous
                    </Button>
                    <Button variant="outline" onClick={() => handlePageChange(currentPage + 1)} disabled={!hasNext}>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
