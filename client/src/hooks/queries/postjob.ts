import { fetchSingleJob, getApprovedJobs, getJobFn } from "@/api/postjob";
import { useQuery } from "@tanstack/react-query";

export function useGetpostJobs(){
    return useQuery({
        queryKey: ["post_job_pending_list"],
        queryFn: getJobFn
    })
}


// for listing in /browse
export function useApprovedJobs(){
    return useQuery({
        queryKey: ["post_job_approved_list"],
        queryFn: getApprovedJobs
    })
}

export function useGetSingleJob(jobId: string | undefined) {
    return useQuery({
        queryKey: ["job", jobId],
        queryFn: () => fetchSingleJob(jobId!),
        enabled: Boolean(jobId)
    })
}