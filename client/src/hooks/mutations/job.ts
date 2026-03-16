import { postJob } from "@/api/job";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateJob(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: postJob,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["jobs"]})
        },
        onError: (error: any) => {
            console.error("Failed to create the job:", error.message)
        }
    })
}