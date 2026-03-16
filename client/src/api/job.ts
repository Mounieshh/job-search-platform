import { baseUrl } from "@/lib/base"
import type { JobFormData } from "@/validate/job.zod"


export type BrowseJobs = {
    jobs: Job[]
}


export type JobDetails = {
    job: JobDetail
}


export type PostJobResponse = {
    message: string,
    job: JobDetail,
    user: JobUser
}

export type PendingJobsResponse = {
    jobs: JobDetail[]
}

type AdminJobActionResponse = {
    message: string
    job?: JobDetail
}

export async function browseJobs(){
    const response = await fetch(`${baseUrl}/api/jobs`, {
        method: "GET",
        credentials: "include"
    })

    if(!response.ok){
        throw new Error("Failed to fetch jobs")
    }

    const data: BrowseJobs = await response.json()
    return data.jobs ?? []
}


export async function JobDetailsLook(companyName: string | undefined, slugId: string | undefined){
    const response = await fetch(`${baseUrl}/api/jobs/${companyName}/${slugId}`, {
        method: "GET",
        credentials: "include"
    })

    if(!response.ok){
        throw new Error("Failed to fetch the job detail")
    }

    const data: JobDetails = await response.json()
    return data.job ?? null
}

export async function postJob(formData: JobFormData){
    const response = await fetch(`${baseUrl}/api/jobs/add`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(formData)
    })

    const data = await response.json().catch(() => ({}))
    if(!response.ok){
        throw new Error(data.message || "Failed to create jobs")
    }

    return data as PostJobResponse ?? null
}


export async function getPendingJobs(){
    const response = await fetch(`${baseUrl}/api/jobs/admin/pending`, {
        method: "GET",
        credentials: "include"
    })

    if(!response.ok){
        throw new Error("Failed to fetch pending jobs")
    }

    const data: PendingJobsResponse = await response.json()
    return data.jobs ?? []
}

export async function adminApproveJob(jobId: string){
    const response = await fetch(`${baseUrl}/api/jobs/admin/approve/${jobId}`, {
        method: "PATCH",
        credentials: "include"
    })

    const data = await response.json().catch(() => ({}))
    if(!response.ok){
        throw new Error(data.message || "Failed to approve job")
    }

    return data as AdminJobActionResponse
}

export async function adminRejectJob(jobId: string, reason: string){
    const response = await fetch(`${baseUrl}/api/jobs/admin/reject/${jobId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({reason})
    })

    const data = await response.json().catch(() => ({}))
    if(!response.ok){
        throw new Error(data.message || "Failed to reject job")
    }

    return data as AdminJobActionResponse
}