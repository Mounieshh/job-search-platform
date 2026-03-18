import { LEAD_QUERY_KEYS, getLeadApproved, leadJobDetails, listLeadRequests } from "@/api/lead"
import { useQuery } from "@tanstack/react-query"

export function useLeadApprovedJobs() {
  return useQuery({
    queryKey: LEAD_QUERY_KEYS.approved,
    queryFn: getLeadApproved,
    retry: false
  })
}

export function useLeadJobDetails(companyName: string | undefined, slugId: string | undefined) {
  return useQuery({
    queryKey: LEAD_QUERY_KEYS.detail(companyName, slugId),
    queryFn: () => leadJobDetails(companyName, slugId),
    enabled: !!companyName && !!slugId,
    retry: false
  })
}

export function useLeadRequests() {
  return useQuery({
    queryKey: LEAD_QUERY_KEYS.requests,
    queryFn: listLeadRequests,
    retry: false
  })
}
