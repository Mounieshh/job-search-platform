import { fetchSingleJob, getApprovedJobs, getJobFn } from "@/api/postjob";
import { useQuery } from "@tanstack/react-query";

export function useGetpostJobs(){
    return useQuery({
        queryKey: ["post_job_pending_list"],
        queryFn: getJobFn
    })
}


export function useApprovedJobs(page = 1, limit = 10){
    return useQuery({
        queryKey: ["post_job_approved_list", page, limit],
        queryFn: () => getApprovedJobs(page, limit)
    })
}

export function useGetSingleJob(jobId: string | undefined) {
    return useQuery({
        queryKey: ["job", jobId],
        queryFn: () => fetchSingleJob(jobId!),
        enabled: Boolean(jobId)
    })
}