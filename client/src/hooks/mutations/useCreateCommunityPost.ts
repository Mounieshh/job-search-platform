import { createCommunityPost } from "@/api/community"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useCreateCommunityPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCommunityPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community_posts"] })
    }
  })
}
