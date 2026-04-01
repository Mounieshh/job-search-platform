import { createJobApplication, createLeadRequest, updateProfile } from "@/api/profile";
import { LEAD_STATUS_KEY, PROFILE_KEY, TRACKED_APPLICATIONS_KEY } from "@/hooks/queries/profile";
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

export const useUpdateProfile = () => {
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

export function useCreateJobApplication() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            jobId,
            resume,
            githubLink,
        }: {
            jobId: string
            resume: string
            githubLink?: string
        }) => createJobApplication(jobId, { resume, githubLink }),
        onSuccess: (_, variables) => {
            toast.success("Application submitted successfully")
            queryClient.invalidateQueries({ queryKey: ["lead_posted_job_applications"] })
            queryClient.invalidateQueries({ queryKey: ["job", variables.jobId] })
            queryClient.invalidateQueries({ queryKey: TRACKED_APPLICATIONS_KEY })
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to submit application")
        },
    })
}
