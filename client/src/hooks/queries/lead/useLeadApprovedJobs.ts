import { getLeadApproved, LEAD_QUERY_KEYS } from "@/api/lead"
import { useQuery } from "@tanstack/react-query"

export function useLeadApprovedJobs(){
    return useQuery({
        queryKey: LEAD_QUERY_KEYS.approved,
        queryFn: getLeadApproved
    })
}