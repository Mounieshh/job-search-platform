import { COMMUNITY_POSTS_QUERY_KEY, fetchCommunityPosts } from "@/api/community"
import { useQuery } from "@tanstack/react-query"


export function useCommunityPosts() {
    return useQuery({
        queryKey: COMMUNITY_POSTS_QUERY_KEY,
        queryFn: fetchCommunityPosts
    })
}