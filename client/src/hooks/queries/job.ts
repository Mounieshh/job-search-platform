import { JobDetailsLook, browseJobs, getAdminApprovedJobs, getPendingJobs } from "@/api/job"
import { useQuery } from "@tanstack/react-query"

export function useBrowseJobs() {
  return useQuery({
    queryKey: ["browse_jobs"],
    queryFn: browseJobs
  })
}

export function useJobDetails(companyName: string | undefined, slugId: string | undefined) {
  return useQuery({
    queryKey: ["job_details", companyName, slugId],
    queryFn: () => JobDetailsLook(companyName, slugId),
    enabled: !!companyName && !!slugId
  })
}

export function usePendingJobs(){
  return useQuery({
    queryKey: ["pending_jobs"],
    queryFn: getPendingJobs
  })
}



export function useAdminApprovedJobs(){
  return useQuery({
    queryKey: ["admin_approved_jobs"],
    queryFn: getAdminApprovedJobs
  })
}