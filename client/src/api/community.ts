import { baseUrl } from "@/lib/base"
import type { CommunityFormData } from "@/validate/community.zod"

export const COMMUNITY_POSTS_QUERY_KEY = ["community_posts"] as const


export type CommunityPostsResponse = {
    posts: CommunityPostItem[]
}

export type CreateCommunityPostResponse = {
    message: string
    post: CommunityPostItem
}

export type LikePostResponse = {
    message: string,
    likes: number
    likedBy: string[]
}

export const fetchCommunityPosts = async () : Promise<CommunityPostItem[]> => {
    const response = await fetch(`${baseUrl}/api/community`, {
        method: "GET",
        credentials: "include"
    })

    if(!response.ok){
        throw new Error("Failed to fetch community posts")
    }

    const data: CommunityPostsResponse = await response.json()
    return data.posts ?? []
}

export const createCommunityPost = async (formData: CommunityFormData): Promise<CreateCommunityPostResponse> => {
    const payload = new FormData()
    payload.append("content", formData.content)
    payload.append("title", formData.title)

    for (const image of formData.images || []) {
        payload.append("images", image)
    }

    const response = await fetch(`${baseUrl}/api/community`, {
        method: "POST",
        body: payload,
        credentials: "include"
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
        throw new Error(data.message || "Unable to create community post")
    }

    return data as CreateCommunityPostResponse
}

export async function likePost(postId: string | undefined){
    const response = await fetch(`${baseUrl}/api/community/${postId}/like`, {
        method: "PATCH",
        credentials: "include"
    })

    if(!response.ok){
        throw new Error("Failed to like the post")
    }

    const data: LikePostResponse = await response.json()
    return data
}