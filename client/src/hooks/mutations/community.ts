import { COMMUNITY_POSTS_QUERY_KEY, createCommunityPost, likePost} from "@/api/community"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useCreateCommunityPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCommunityPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMMUNITY_POSTS_QUERY_KEY })
    }
  })
}


export function useLikePost(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: likePost,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["community_posts"]
      })
    }
  })
}
