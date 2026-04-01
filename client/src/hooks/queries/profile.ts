import { useQuery } from "@tanstack/react-query";
import { getLeadRequestStatus, getMyTrackedApplications, getUserProfile } from "@/api/profile";

export const PROFILE_KEY = ["user_profile"];
export const LEAD_STATUS_KEY = ["lead_request_status"];
export const TRACKED_APPLICATIONS_KEY = ["tracked_applications"];

export function useUserProfile() {
    return useQuery({
        queryKey: PROFILE_KEY,
        queryFn: getUserProfile,
    });
}

export function useLeadRequestStatus() {
    return useQuery({
        queryKey: LEAD_STATUS_KEY,
        queryFn: getLeadRequestStatus,
    });
}

export function useMyTrackedApplications() {
    return useQuery({
        queryKey: TRACKED_APPLICATIONS_KEY,
        queryFn: getMyTrackedApplications,
    })
}
