import { LEAD_QUERY_KEYS, listLeadRequests } from "@/api/lead"
import { useQuery } from "@tanstack/react-query"

export function useLeadRequests(){
    return useQuery({
        queryKey: LEAD_QUERY_KEYS.requests,
        queryFn: listLeadRequests
    })
}