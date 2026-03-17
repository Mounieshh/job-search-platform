import { useState } from "react"
import { Heart } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Spinner } from "../ui/spinner"
import { useCommunityPosts } from "@/hooks/queries/community"
import { useLikePost } from "@/hooks/mutations/community"
import { useSession } from "@/hooks/queries/auth"

const PREVIEW_LENGTH = 150

const CommunityPostList = () => {

    const { data = [], isPending, error } = useCommunityPosts()
    const { mutateAsync: likePost } = useLikePost()
    const { data: user } = useSession()
    const [selectedPost, setSelectedPost] = useState<CommunityPostItem | null>(null)

    if(isPending){
            return (
                <div className="min-h-screen flex justify-center items-center">
                        <Spinner className="size-7"/>
                </div>
            )
    }

     if (error) {
        return (
            <div>
                Nothing to show
            </div>
        )
     }

  return (
    <>
    <div className="space-y-4">
        {data.length === 0 ? (
            <div>
                Nothing to Show
            </div>
        ): (
            <div className="space-y-4">
                {data.map((post) => {
                    const likedBy = post.likedBy ?? []
                    const hasLiked = Boolean(user?.id && likedBy.includes(user.id))
                    const likeCount = likedBy.length

                    return (
                    <Card key={post.id} className="rounded-none">
                        <CardHeader>
                            <CardTitle>
                                {post.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm leading-6">
                                {post.content.length > PREVIEW_LENGTH
                                    ? post.content.slice(0, PREVIEW_LENGTH).trimEnd() + "…"
                                    : post.content}
                            </div>
                            {post.content.length > PREVIEW_LENGTH && (
                                <button
                                    onClick={() => setSelectedPost(post)}
                                    className="mt-1 text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 cursor-pointer transition-colors"
                                >
                                    Read More
                                </button>
                            )}
                            {post.images?.length > 0 ? (
                                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                                    {post.images.map((image, index) => (
                                        <img
                                        key={`${post.id}-image-${index}`}
                                        src={image}
                                        alt={`Post image ${index + 1}`}
                                        className="h-28 w-full rounded border object-cover"
                                        />
                                    ))}
                                </div>
                            ) : null}
                        </CardContent>
                        <CardFooter className="border-t pt-4">
                            <div className="flex w-full items-center justify-between gap-4">
                                <button
                                onClick={() => likePost(post.id)}
                                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-red-500 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Heart
                                    className={`size-4 ${hasLiked ? "fill-red-500 text-red-500" : ""}`}
                                />
                                <span>{likeCount}</span>
                            </button>
                                <div className="flex items-center gap-2">
                                    <div className="max-w-44 truncate text-sm font-medium">
                                        {post.anonymousName}
                                    </div>
                                    <div>
                                        <img 
                                        src={post.anonymousAvatar} 
                                        alt="Anonymous Image" 
                                        className="size-8 rounded-full border object-cover"
                                        height={32}
                                        width={32}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardFooter>
                     
                    </Card>
                    )
                })}
            </div>
        )}
    </div>

    <Dialog open={!!selectedPost} onOpenChange={(open) => { if (!open) setSelectedPost(null) }}>
        <DialogContent className="rounded-none max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>{selectedPost?.title}</DialogTitle>
            </DialogHeader>
            <p className="text-sm leading-7 whitespace-pre-line text-card-foreground">
                {selectedPost?.content}
            </p>
            {selectedPost?.images && selectedPost.images.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {selectedPost.images.map((image, index) => (
                        <img
                            key={`dialog-image-${index}`}
                            src={image}
                            alt={`Post image ${index + 1}`}
                            className="h-28 w-full rounded border object-cover"
                        />
                    ))}
                </div>
            )}
        </DialogContent>
    </Dialog>
    </>
  )
}

export default CommunityPostList