import { baseUrl } from "@/lib/base";
import type { PostJobFormData, PostTipTapData } from "@/validate/post.zod";


type PostJobResponse = {
    jobId: string  // ← matches what your backend returns
}

type PatchJobResponse = {
    success: boolean
    job: JobData
}

type GetPostJobsResponse = {
    jobs: JobData[]
}

type GetApprovedJobResponse = {
    jobs: JobData[]
    pagination: {
        currentPage: number
        totalPages: number
        totalJobs: number
    }
}

type GetSingleJobResponse = {
    message: string
    job: JobData
}

export async function postNewJob(formData: PostJobFormData) {
    const response = await fetch(`${baseUrl}/api/jobs/make`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.message || "Failed to create job")

    return data as PostJobResponse
}

export async function patchNewJobTipTap(formData: PostTipTapData, jobId: string | undefined) {
    const response = await fetch(`${baseUrl}/api/jobs/make/${jobId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.message || "Failed to patch job")

    return data as PatchJobResponse
}

export async function getApprovedJobs(page = 1, limit = 10){
    const response = await fetch(`${baseUrl}/api/jobs/browse?page=${page}&limit=${limit}`, {
        method: "GET",
        credentials: "include"
    })

    if(!response.ok){
        throw new Error("Failed to fetch the jobs")
    }

    const data: GetApprovedJobResponse = await response.json()

    return data
}


export async function fetchSingleJob(jobId: string | undefined){
    const response = await fetch(`${baseUrl}/api/jobs/${jobId}`, {
        method: "GET",
        credentials: "include"
    })

    const data: GetSingleJobResponse = await response.json()
    if (!response.ok) throw new Error(data.message || "Failed to fetch job")

    return data.job
}

export async function getJobFn(){
    const response = await fetch(`${baseUrl}/api/jobs`, {
        method: "GET",
        credentials: "include"
    })

    if(!response.json){
        throw new Error("Failed to fetch the jobs")
    }

    const data: GetPostJobsResponse = await response.json()

    return data ?? []
}