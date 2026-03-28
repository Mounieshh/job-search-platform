import { adminReviewJob } from "@/api/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAdminReviewJob(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({jobId, action, reason}: {
            jobId: string
            action: string
            reason?: string
        }) => adminReviewJob(jobId, action, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin_review_job"]})
        },
        onError: (error: any) => {
            console.error("Failed to review job: ", error)
        }
    })
}