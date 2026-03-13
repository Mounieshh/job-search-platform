import { leadJobDetails, LEAD_QUERY_KEYS } from "@/api/lead"
import { useQuery } from "@tanstack/react-query"

export function useLeadJobDetails(companyName: string | undefined, slugId: string | undefined){
    return useQuery({
        queryKey: LEAD_QUERY_KEYS.detail(companyName, slugId),
        queryFn: () => leadJobDetails(companyName, slugId),
        enabled: !!companyName && !!slugId
    })
}