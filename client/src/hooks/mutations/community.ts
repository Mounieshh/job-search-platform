import { COMMUNITY_POSTS_QUERY_KEY, createCommunityPost, deleteCommunityPost, likePost, updateCommunityPost } from "@/api/community"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

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
    onSuccess: (data, postId) => {
      queryClient.setQueryData(COMMUNITY_POSTS_QUERY_KEY, (old: any) => 
        old.map((post: any) => 
          post.id === postId ? { ...post, likedBy: data.likedBy } : post
        ) 
      )
    }
  })
}

export function useUpdateCommunityPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, title, content }: { postId: string; title?: string; content?: string }) =>
      updateCommunityPost(postId, { title, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMMUNITY_POSTS_QUERY_KEY })
      toast.success("Post updated")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update post")
    },
  })
}

export function useDeleteCommunityPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => deleteCommunityPost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMMUNITY_POSTS_QUERY_KEY })
      toast.success("Post deleted")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete post")
    },
  })
}
