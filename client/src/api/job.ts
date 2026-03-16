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
