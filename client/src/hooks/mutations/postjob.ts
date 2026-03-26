import { patchNewJobTipTap, postNewJob } from "@/api/postjob";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PostTipTapData } from "@/validate/post.zod";

export function useCreatePostJob() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: postNewJob,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["browse_post_jobs"] })
        },
        onError: (error: any) => {
            console.error("Failed to create the job: ", error.message)
        }
    })
}


export function usePatchPostJob() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ formData, jobId }: { formData: PostTipTapData, jobId: string | undefined }) =>
            patchNewJobTipTap(formData, jobId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["browse_post_jobs"] })
        },
        onError: (error: any) => {
            console.error("Failed to patch job: ", error.message)
        }
    })
}