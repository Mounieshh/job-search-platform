import { adminReviewJob, adminReviewLeadRequest } from "@/api/admin";
import { ADMIN_COMPANY_DIRECTORY_KEY, ADMIN_LEAD_REQUESTS_KEY } from "@/hooks/queries/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useAdminReviewJob(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({jobId, action, reason}: {
            jobId: string
            action: string
            reason?: string
        }) => adminReviewJob(jobId, action, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin_pending_jobs"]})
            toast.success("Job review submitted");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to review job");
        }
    })
}

export function useAdminReviewLeadRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ requestId, action, adminComment }: { 
            requestId: string; 
            action: string; 
            adminComment?: string 
        }) => adminReviewLeadRequest(requestId, action, adminComment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ADMIN_LEAD_REQUESTS_KEY });
            queryClient.invalidateQueries({ queryKey: ADMIN_COMPANY_DIRECTORY_KEY });
            queryClient.invalidateQueries({ queryKey: ["company_list"] });
            toast.success("Lead request processed successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to process lead request");
        }
    });
}