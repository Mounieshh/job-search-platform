import { baseUrl } from "@/lib/base";

type AdminPendingJobResponse = {
    jobs: JobDataWithUser[]
}

type AdminReviewedResponse = {
    jobs: JobDataWithUser[]
}

type AdminJobReviewResponse = {
    job: JobDataWithUser
}

type AdminSingleJobResponse = {
    job: JobDataWithUser
}

export async function getAdminPendingJobs(){
    const response = await fetch(`${baseUrl}/api/admin/jobs/pending`, {
        method: "GET",
        credentials: "include"
    })

    if(!response.ok){
        throw new Error("Failed to fetch the pending jobs")
    }

    const data: AdminPendingJobResponse = await response.json()
    return data.jobs ?? []
}

export async function getAdminReviewedJobs(){
    const response = await fetch(`${baseUrl}/api/admin/jobs/reviewed`, {
        method: "GET",
        credentials: "include"
    })

    if(!response.ok){
        throw new Error("Failed to Fetch the jobs")
    }

    const data: AdminReviewedResponse = await response.json()
    return data.jobs ?? []
}

export async function adminReviewJob(jobId: string, action: string, reason?: string){
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

    const data: AdminJobReviewResponse = await response.json()

    return data.job ?? null
}

export async function fetchAdminSingleJob(jobId: string | undefined){
    const response = await fetch(`${baseUrl}/api/admin/job/preview/${jobId}`, {
        method: "GET",
        credentials: "include"
    })

    const data: AdminSingleJobResponse = await response.json()
    if(!response.ok){
        throw new Error("Failed to fetch the job")
    }
    return data.job
}