import { useQuery } from "@tanstack/react-query";
import { getLeadRequestStatus, getUserProfile } from "@/api/profile";

export const PROFILE_KEY = ["user_profile"];
export const LEAD_STATUS_KEY = ["lead_request_status"];

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
