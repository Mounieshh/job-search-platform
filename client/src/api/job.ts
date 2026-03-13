import { baseUrl } from "@/lib/base"


export type BrowseJobs = {
    jobs: Job[]
}


export type JobDetails = {
    job: JobDetail
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
