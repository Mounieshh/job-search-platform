import { fetchJobApprovalInfo, leadReviewedJobs, listLeadPosted, listLeadRequests } from "@/api/lead"
import { useQuery } from "@tanstack/react-query"

export function useLeadRequests(){
  return useQuery({
    queryKey: ["lead_pending_jobs"],
    queryFn: listLeadRequests
  })
}


export function useGetJobApprovalInfo(jobId: string | undefined) {
    return useQuery({
        queryKey: ["job_approval", jobId],
        queryFn: () => fetchJobApprovalInfo(jobId!),
        enabled: Boolean(jobId)
    })
}


export function useLeadApprovedJobs(){
  return useQuery({
    queryKey: ["lead_approved_jobs"],
    queryFn: leadReviewedJobs
  })
}


export function useLeadPostedJobs(){
  return useQuery({
    queryKey: ["lead_posted_jobs"],
    queryFn: listLeadPosted
  })
}