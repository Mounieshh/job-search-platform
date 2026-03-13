import { baseUrl } from "@/lib/base"

export const LEAD_QUERY_KEYS = {
    requests: ["lead_requests"] as const,
    approved: ["lead_approved_jobs"] as const,
    detail: (companyName?: string, slugId?: string) => ["lead_detail", companyName, slugId] as const
}

export type LeadApproved = {
    jobs: Job[]
}

export type LeadRequests = {
    jobs: Job[]
}

export type LeadDetails = {
    job: JobDetail
}

export type RejectLeadJobPayload = {
    jobId: string
    reason: string
}

export const getLeadApproved = async (): Promise<Job[]> => {
    const response = await fetch(`${baseUrl}/api/lead/approved-by-me`, {
        method: "GET",
        credentials: "include"
    })

    if(!response.ok){
        throw new Error("Failed to fetch the Jobs approved by you..")
    }

    const data: LeadApproved = await response.json()
    return data.jobs ?? []
}


export const listLeadRequests = async () => {
    const response = await fetch(`${baseUrl}/api/lead/requests`, {
        method: "GET",
        credentials: "include"
    })

    if(!response.ok){
        throw new Error("Failed to fetch Requests")
    }

    const data: LeadRequests = await response.json()
    return data.jobs ?? []
}


export const leadJobDetails = async (companyName: string | undefined, slugId: string | undefined) => {
    const response = await fetch(`${baseUrl}/api/lead/${companyName}/${slugId}`, {
        method: "GET",
        credentials: "include"
    })

    if(!response.ok){
        throw new Error("Failed to fetch the job details")
    }

    const data: LeadDetails = await response.json()
    return data.job ?? null
}

export const approveJob = async (jobId: string) => {
    const response = await fetch(`${baseUrl}/api/lead/approve/${jobId}`, {
        method: "PATCH",
        credentials: "include"
    })

    if(!response.ok){
        throw new Error("Failed to Approve Job")
    }

    const data = await response.json()
    return data

}

export const rejectJob = async ({ jobId, reason }: RejectLeadJobPayload) => {
    const response = await fetch(`${baseUrl}/api/lead/reject/${jobId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ reason })
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
        throw new Error(data.message || "Failed to Reject Job")
    }

    return data
}