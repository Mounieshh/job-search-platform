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
