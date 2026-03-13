import { LEAD_QUERY_KEYS, rejectJob } from "@/api/lead"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useRejectLeadJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: rejectJob,
    mutationKey: ["reject_job"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEAD_QUERY_KEYS.requests })
      queryClient.invalidateQueries({ queryKey: LEAD_QUERY_KEYS.approved })
    }
  })
}
