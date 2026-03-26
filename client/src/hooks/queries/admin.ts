import { getAdminPendingJobs, getAdminReviewedJobs } from "@/api/admin";
import { useQuery } from "@tanstack/react-query";

export function useAdminPendingJobs(){
    return useQuery({
        queryKey: ["admin_pending_jobs"],
        queryFn: getAdminPendingJobs
    })
}

export function useAdminReviewedJobs(){
    return useQuery({
        queryKey: ["admin_reviewed_jobs"],
        queryFn: getAdminReviewedJobs
    })
}