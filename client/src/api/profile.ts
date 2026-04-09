import { baseUrl } from "@/lib/base";

export async function getUserProfile(): Promise<ProfileResponse> {
    const response = await fetch(`${baseUrl}/api/user/profile`, {
        method: "GET",
        credentials: "include"
    })

    if (!response.ok) throw new Error("Failed to fetch the profile info")
    
    const data = await response.json()
    return { user: data.user, profile: data.profile }
}

export async function updateProfile(body: Record<string, unknown>): Promise<ProfileResponse> {
    const response = await fetch(`${baseUrl}/api/user/profile`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || "Failed to update profile")
    return { user: data.user, profile: data.profile }
}

export async function createLeadRequest(formData: any): Promise<{ message: string; leadRequest: LeadRequest }> {
    const response = await fetch(`${baseUrl}/api/user/request-as-lead`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.message || "Failed to submit request")
    return data
}

export async function getLeadRequestStatus(): Promise<LeadRequest | null> {
    const response = await fetch(`${baseUrl}/api/user/lead-status`, {
        method: "GET",
        credentials: "include"
    })

    if (!response.ok) throw new Error("Failed to fetch lead request status")
    const data = await response.json()
    return data.leadRequest
}

type CreateApplicationPayload = {
    resume: string
    githubLink?: string
}

type CreateApplicationResponse = {
    message: string
}

export type UserTrackedApplication = {
    id: string
    userId: string
    profileId: string
    githubLink: string | null
    resume: string
    status: string
    aiScore: number | null
    rejectionReason: string | null
    jobId: string
    createdAt: string
    updatedAt: string
    job: JobData | null
}

export async function createJobApplication(jobId: string, payload: CreateApplicationPayload): Promise<CreateApplicationResponse> {
    const response = await fetch(`${baseUrl}/api/user/application/${jobId}/apply`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
        throw new Error(data.message || "Failed to submit application")
    }

    return data as CreateApplicationResponse
}

export async function getMyTrackedApplications(): Promise<UserTrackedApplication[]> {
    const response = await fetch(`${baseUrl}/api/user/applications/tracking`, {
        method: "GET",
        credentials: "include",
    })

    if (!response.ok) {
        throw new Error("Failed to fetch tracked applications")
    }

    const data = await response.json()
    return data.applications ?? []
}
