import { reviewJob, shortlistTopApplications } from "@/api/lead"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

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

export function useShortlistTopApplications() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ jobId }: { jobId: string }) => shortlistTopApplications(jobId),
        onSuccess: (_, variables) => {
            toast.success("AI shortlist completed")
            queryClient.invalidateQueries({ queryKey: ["lead_posted_job_applications", "job", variables.jobId] })
            queryClient.invalidateQueries({ queryKey: ["tracked_applications"] })
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to shortlist applications")
        },
    })
}