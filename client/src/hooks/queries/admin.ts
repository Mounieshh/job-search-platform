import { fetchAdminSingleJob, getAdminLeadRequests, getAdminPendingJobs, getAdminReviewedJobs } from "@/api/admin";
import { getAdminCompanyDirectory } from "@/api/company";
import { useQuery } from "@tanstack/react-query";

export const ADMIN_LEAD_REQUESTS_KEY = ["admin_lead_requests"];
export const ADMIN_COMPANY_DIRECTORY_KEY = ["admin_company_directory"];

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

export function useAdminSingleJob(jobId: string | undefined){
    return useQuery({
        queryKey: ["admin_preview_job", jobId],
        queryFn: () => fetchAdminSingleJob(jobId!),
        enabled: Boolean(jobId)
    })
}

export function useAdminLeadRequests() {
    return useQuery({
        queryKey: ADMIN_LEAD_REQUESTS_KEY,
        queryFn: getAdminLeadRequests
    });
}

export function useAdminCompanyDirectory() {
    return useQuery({
        queryKey: ADMIN_COMPANY_DIRECTORY_KEY,
        queryFn: getAdminCompanyDirectory,
    });
}