import { baseUrl } from "@/lib/base";

export async function getAdminPendingJobs(): Promise<JobDataWithUser[]> {
    const response = await fetch(`${baseUrl}/api/admin/jobs/pending`, {
        method: "GET",
        credentials: "include"
    })

    if(!response.ok){
        throw new Error("Failed to fetch the pending jobs")
    }

    const data = await response.json()
    return data.jobs ?? []
}

export async function getAdminReviewedJobs(): Promise<JobDataWithUser[]> {
    const response = await fetch(`${baseUrl}/api/admin/jobs/reviewed`, {
        method: "GET",
        credentials: "include"
    })

    if(!response.ok){
        throw new Error("Failed to Fetch the jobs")
    }

    const data = await response.json()
    return data.jobs ?? []
}

export async function adminReviewJob(jobId: string, action: string, reason?: string): Promise<JobDataWithUser | null> {
    const response = await fetch(`${baseUrl}/api/admin/review/${jobId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({action, reason})
    })

    if(!response.ok){
        throw new Error("Failed to review job")
    }

    const data = await response.json()
    return data.job ?? null
}

export async function fetchAdminSingleJob(jobId: string | undefined): Promise<JobDataWithUser> {
    const response = await fetch(`${baseUrl}/api/admin/job/preview/${jobId}`, {
        method: "GET",
        credentials: "include"
    })

    if(!response.ok){
        throw new Error("Failed to fetch the job")
    }
    const data = await response.json()
    return data.job
}

export async function getAdminLeadRequests(): Promise<LeadRequest[]> {
    const response = await fetch(`${baseUrl}/api/admin/lead-requests`, {
        method: "GET",
        credentials: "include"
    })

    if (!response.ok) throw new Error("Failed to fetch lead requests")
    const data = await response.json()
    return data.requests ?? []
}

export async function adminReviewLeadRequest(requestId: string, action: string, adminComment?: string): Promise<LeadRequest> {
    const response = await fetch(`${baseUrl}/api/admin/lead-requests/${requestId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, adminComment })
    })

    if (!response.ok) throw new Error("Failed to process lead request")
    const data = await response.json()
    return data.leadRequest
}