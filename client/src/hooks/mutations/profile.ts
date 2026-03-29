import { createLeadRequest, updateProfile } from "@/api/profile";
import { LEAD_STATUS_KEY, PROFILE_KEY } from "@/hooks/queries/profile";
import { SESSION_KEY } from "@/hooks/queries/auth";
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

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROFILE_KEY });
            queryClient.invalidateQueries({ queryKey: SESSION_KEY });
            toast.success("Profile updated");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update profile");
        },
    });
}
