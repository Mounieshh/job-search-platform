import { fetchCommunityPosts } from "@/api/community"
import { useQuery } from "@tanstack/react-query"


export function useCommunityPosts() {
    return useQuery({
        queryKey: ["community_posts"],
        queryFn: fetchCommunityPosts
    })
}