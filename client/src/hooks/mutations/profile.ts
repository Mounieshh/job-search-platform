import { createLeadRequest } from "@/api/profile";
import { LEAD_STATUS_KEY } from "@/hooks/queries/profile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateLeadRequest() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createLeadRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: LEAD_STATUS_KEY });
            toast.success("Request submitted successfully!");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to submit request");
        }
    });
}
