import { baseUrl } from "@/lib/base"


export type RejectLeadJobPayload = {
    jobId: string
    reason: string
}


type LeadPendingResponse = {
    jobs: JobDataWithUser[]
}

type LeadReviewResponse = {
    job: JobData
}

type LeadApprovedResponse = {
    jobs: JobData[]
}

type LeadPostedJobsResponse = {
    fetchJobs: JobData[]
}

export type LeadApplicationItem = {
    id: string
    userId: string
    profileId: string
    githubLink: string | null
    resume: string
    status: string
    aiScore: number | null
    aiReason: string | null
    aiSuggestions: string | null
    jobId: string
    createdAt: string
    updatedAt: string
    applicant: Pick<User, "_id" | "name" | "email" | "role"> | null
    profile: Pick<UserProfile, "_id" | "phone" | "location" | "skills" | "publicLinks" | "resumeUrl"> | null
}

export type LeadPostedJobWithApplications = JobData & {
    applicationsCount: number
}

type LeadPostedApplicationsResponse = {
    jobs: LeadPostedJobWithApplications[]
}

type LeadJobApplicationsResponse = {
    job: JobData
    applications: LeadApplicationItem[]
    stats: {
        total: number
        shortlisted: number
        rejected: number
        pending: number
    }
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export const listLeadRequests = async () => {
    const response = await fetch(`${baseUrl}/api/lead/job-requests/pending`, {
        method: "GET",
        credentials: "include"
    })

    if(!response.ok){
        throw new Error("Failed to fetch Requests")
    }

    const data: LeadPendingResponse = await response.json()
    return data.jobs ?? []
}


export async function reviewJob(jobId: string, action: string, reason?: string) {
    const response = await fetch(`${baseUrl}/api/lead/review/${jobId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason })
    })

    const data: LeadReviewResponse = await response.json()
    if (!response.ok) throw new Error("Failed to review job")

    return data.job ?? null
}

export async function fetchJobApprovalInfo(jobId: string) {
    const response = await fetch(`${baseUrl}/api/lead/approval-info/${jobId}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.message || "Failed to fetch approval info")

    return data.approval
}

export async function leadReviewedJobs(){
    const response = await fetch(`${baseUrl}/api/lead/approved-by-me`, {
        method: "GET",
        credentials: "include"
    })

    const data: LeadApprovedResponse = await response.json()

    if(!response.ok){
        throw new Error("Failed to fetch the approved jobs")
    }

    return data.jobs ?? []
}


export async function listLeadPosted(){
    const response = await fetch(`${baseUrl}/api/lead/posted`, {
        method : "GET",
        credentials: 'include'
    })

    if(!response.ok){
        throw new Error("Failed to fetch jobs")
    }

    const data: LeadPostedJobsResponse = await response.json()

    return data.fetchJobs ?? []
}

export async function listLeadPostedApplications() {
    const response = await fetch(`${baseUrl}/api/lead/posted/applications`, {
        method: "GET",
        credentials: "include",
    })

    if (!response.ok) {
        throw new Error("Failed to fetch applications for posted jobs")
    }

    const data: LeadPostedApplicationsResponse = await response.json()

    return data.jobs ?? []
}

export async function listLeadJobApplications(jobId: string, page = 1, limit = 10) {
    const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    })

    const response = await fetch(`${baseUrl}/api/lead/posted/${jobId}/applications?${query.toString()}`, {
        method: "GET",
        credentials: "include",
    })

    if (!response.ok) {
        throw new Error("Failed to fetch applications for selected job")
    }

    const data: LeadJobApplicationsResponse = await response.json()

    return {
        job: data.job,
        applications: data.applications ?? [],
        stats: data.stats,
        pagination: data.pagination,
    }
}

type LeadShortlistResponse = {
    message: string
    shortlisted: Array<{
        applicationId: string
        score: number
        reason?: string
    }>
    totalApplications: number
    shortlistedCount: number
}

export async function shortlistTopApplications(jobId: string): Promise<LeadShortlistResponse> {
    const response = await fetch(`${baseUrl}/api/lead/posted/${jobId}/applications/shortlist`, {
        method: "POST",
        credentials: "include",
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
        throw new Error(data.message || "Failed to shortlist applications")
    }

    return data as LeadShortlistResponse
}

export async function manualShortlistApplication(payload: {
    applicationId: string
    action: "shortlist" | "reject"
    reason?: string
}) {
    const response = await fetch(`${baseUrl}/api/lead/applications/manual-shortlist`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(data.message || "Failed to update application")
    return data.application
}

export async function closeJobApplications(jobId: string): Promise<JobData> {
    const response = await fetch(`${baseUrl}/api/lead/posted/${jobId}/close`, {
        method: "PATCH",
        credentials: "include",
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(data.message || "Failed to close applications")
    return data.job
}