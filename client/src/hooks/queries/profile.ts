import { getTrackPosts, getUserProfile } from "@/api/profile";
import { useQuery } from "@tanstack/react-query";

export function useProfile(){
    return useQuery({
        queryKey: ["profile"],
        queryFn: getUserProfile
    })
}

export function useTrackMyPostsUser(){
    return useQuery({
        queryKey: ["user_posts"],
        queryFn: getTrackPosts
    })
}