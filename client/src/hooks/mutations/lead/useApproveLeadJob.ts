import { approveJob, LEAD_QUERY_KEYS } from "@/api/lead"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useApproveLeadJob() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: approveJob,
        mutationKey: ["approve_job"],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: LEAD_QUERY_KEYS.approved })
            queryClient.invalidateQueries({ queryKey: LEAD_QUERY_KEYS.requests })
        }
    })
}