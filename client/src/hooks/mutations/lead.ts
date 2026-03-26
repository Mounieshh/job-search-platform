import { reviewJob } from "@/api/lead"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useReviewJob() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ jobId, action, reason }: {
            jobId: string
            action: string
            reason?: string
        }) => reviewJob(jobId, action, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lead_pending_review_jobs"] })
        },
        onError: (error: any) => {
            console.error("Failed to review job:", error.message)
        }
    })
}