import { LEAD_QUERY_KEYS, approveJob, rejectJob } from "@/api/lead"
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
