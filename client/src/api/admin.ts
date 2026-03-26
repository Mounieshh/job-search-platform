import { baseUrl } from "@/lib/base";

type AdminPendingJobResponse = {
    jobs: JobDataWithUser[]
}

type AdminReviewedResponse = {
    jobs: JobDataWithUser[]
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