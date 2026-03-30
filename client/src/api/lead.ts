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