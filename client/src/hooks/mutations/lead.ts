import { manualShortlistApplication, reviewJob, shortlistTopApplications, closeJobApplications } from "@/api/lead"
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
            queryClient.invalidateQueries({ queryKey: ["lead_pending_jobs"] })
            queryClient.invalidateQueries({ queryKey: ["lead_approved_jobs"] })
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
            toast.success("AI suggestions generated")
            queryClient.invalidateQueries({ queryKey: ["lead_posted_job_applications", "job", variables.jobId] })
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to generate AI suggestions")
        },
    })
}

export function useManualShortlist(jobId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: { applicationId: string; action: "shortlist" | "reject"; reason?: string }) =>
            manualShortlistApplication(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lead_posted_job_applications", "job", jobId] })
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update application")
        },
    })
}

export function useCloseJobApplications() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (jobId: string) => closeJobApplications(jobId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lead_posted_job_applications"] })
            toast.success("Applications closed — job removed from browse listings")
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to close applications")
        },
    })
}
