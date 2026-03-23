import { JobDetailsLook, browseJobs, getAdminApprovedJobs, getAdminJobDetail, getPendingJobs } from "@/api/job"
import { useQuery } from "@tanstack/react-query"

export function useBrowseJobs(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["browse_jobs", page, limit],
    queryFn: () => browseJobs(page, limit)
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


export function useAdminJobDetails(companyName: string | undefined, slugId: string | undefined){
  return useQuery({
    queryKey: ["admin_job_details", companyName, slugId],
    queryFn: () => getAdminJobDetail(companyName, slugId),
    enabled: !!companyName && !!slugId
  })
}

