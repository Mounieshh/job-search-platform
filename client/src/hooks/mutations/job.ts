import { adminApproveJob, adminRejectJob, postJob } from "@/api/job";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type AdminRejectPayload = {
    jobId: string
    reason: string
}

export function useCreateJob(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: postJob,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["browse_jobs"]})
        },
        onError: (error: any) => {
            console.error("Failed to create the job:", error.message)
        }
    })
}


export function useAdminApprove(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: adminApproveJob,
        mutationKey: ["admin_approve_job"],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pending_jobs"] })
            queryClient.invalidateQueries({ queryKey: ["browse_jobs"] })
        },
        onError: (error: any) => {
            console.error("Failed to approve the job:", error.message)
        }
    })
}


export function useAdminReject(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ jobId, reason }: AdminRejectPayload) => adminRejectJob(jobId, reason),
        mutationKey: ["admin_reject_job"],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pending_jobs"] })
            queryClient.invalidateQueries({ queryKey: ["browse_jobs"] })
        },
        onError: (error: any) => {
            console.error("Failed to reject the job:", error.message)
        }
    })
}