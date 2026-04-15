import { useMemo, useState } from "react"
import { Heart, Search, Briefcase, Pencil, Trash2 } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter as DialogFoot, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { useCommunityPosts } from "@/hooks/queries/community"
import { useDeleteCommunityPost, useLikePost, useUpdateCommunityPost } from "@/hooks/mutations/community"
import { useSession } from "@/hooks/queries/auth"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"

const PREVIEW_LENGTH = 150

function formatPostDate(value: string) {
    return new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    })
}

function formatVerificationStatus(post: CommunityPostItem) {
    return post.user?.isEmailVerified ? "Verified Member" : "Community Member"
}

const CommunityPostList = () => {

    const { data = [], isPending, error } = useCommunityPosts()
    const { mutateAsync: likePost } = useLikePost()
    const { mutate: deletePost, isPending: isDeleting } = useDeleteCommunityPost()
    const { mutate: updatePost, isPending: isUpdating } = useUpdateCommunityPost()
    const { data: user } = useSession()
    const [selectedPost, setSelectedPost] = useState<CommunityPostItem | null>(null)
    const [editPost, setEditPost] = useState<CommunityPostItem | null>(null)
    const [editTitle, setEditTitle] = useState("")
    const [editContent, setEditContent] = useState("")
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

    const isAdmin = user?.role === "ADMIN"

    const [searchText, setSearchText] = useState("")

    const filteredJobs = useMemo(() => {
        const normalizedQuery = searchText.trim().toLowerCase()

        return data.filter((job) => {
            const combined = [job.title, job.content, job.user?.name]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
            return !normalizedQuery || combined.includes(normalizedQuery)
        })
    }, [data, searchText])

    if(isPending){
            return (
                <div className="min-h-screen flex justify-center items-center">
                        <Spinner className="size-7"/>
                </div>
            )
    }

     if (error) {
        return (
            <div className="border border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
                Please Sign in to see post 
            </div>
        )
     }

  return (
    <>
    <div className="space-y-4">
        <div className="flex items-end justify-between pb-3">
            <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    placeholder="Search by title or content keyword"
                    className="pl-9 h-10 w-full"
                />
            </div>
        </div>

        {filteredJobs.length === 0 ? (
            <div className="border border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
                No community posts yet.
            </div>
        ): (
            <div className="space-y-4">
                {filteredJobs.map((post) => {
                    const likedBy = post.likedBy ?? []
                    const hasLiked = Boolean(user?.id && likedBy.includes(user.id))
                    const likeCount = likedBy.length

                    return (
                    <Card key={post.id} className="rounded-none overflow-hidden">
                        <CardHeader className="space-y-4 border-b border-border pb-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <img 
                                    src={post.anonymousAvatar} 
                                    alt="Anonymous Image" 
                                    className="size-10 rounded-full border object-cover"
                                    height={40}
                                    width={40}
                                    />
                                    <div className="min-w-0">
                                        <div className="truncate text-sm font-medium text-card-foreground">
                                            {post.user?.name}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {formatVerificationStatus(post)}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex shrink-0 items-center gap-1">
                                    {(isAdmin || user?.id === post.postedUser) && (
                                        <>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                                onClick={() => {
                                                    setEditPost(post)
                                                    setEditTitle(post.title ?? "")
                                                    setEditContent(post.content)
                                                }}
                                            >
                                                <Pencil className="size-3.5" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                                onClick={() => setDeleteConfirmId(post.id)}
                                            >
                                                <Trash2 className="size-3.5" />
                                            </Button>
                                        </>
                                    )}
                                    <span className="border border-border px-2 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                                        {formatPostDate(post.createdAt)}
                                    </span>
                                </div>
                            </div>

                            <CardTitle className="text-lg leading-snug">
                                {post.title || "Untitled post"}
                            </CardTitle>
                            {post.isHiring && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full w-fit">
                                    <Briefcase className="size-3" /> Hiring
                                </span>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-4 pt-5">
                            <div className="text-sm leading-6 text-card-foreground/90">
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

                            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                                {post.images?.map((image, index) => (
                                    <Dialog key={`${post.id}-image-${index}`}>
                                        <DialogTrigger asChild>
                                            <div className="group relative cursor-zoom-in">
                                            <img
                                                src={image}
                                                alt={`Post image ${index + 1}`}
                                                className="h-28 w-full rounded-none border object-cover transition-all group-hover:brightness-90 sm:h-36 lg:h-40"
                                            />
                                            </div>
                                        </DialogTrigger>

                                        <DialogContent className="max-w-[95vw] border-none bg-transparent p-0 shadow-none sm:max-w-3xl lg:max-w-5xl">
                                            <div className="relative flex items-center justify-center p-2">
                                            <img
                                                src={image}
                                                alt="Full size preview"
                                                className="h-auto max-h-[85vh] w-full rounded-md object-contain shadow-2xl"
                                            />
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="border-t pt-4">
                            <div className="flex w-full items-center justify-between gap-4">
                                <button
                                onClick={() => likePost(post.id)}
                                className="flex items-center gap-1.5 border border-border px-2.5 py-1.5 text-sm text-muted-foreground hover:text-red-500 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Heart
                                    className={`size-4 ${hasLiked ? "fill-red-500 text-red-500" : ""}`}
                                />
                                <span>{likeCount} likes</span>
                            </button>
                                <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                                    community
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
                <DialogTitle className="font-semibold italic">{selectedPost?.title}</DialogTitle>
            </DialogHeader>
            <p className="text-sm leading-7 whitespace-pre-line text-card-foreground text-justify">
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

    {/* Edit dialog */}
    <Dialog open={!!editPost} onOpenChange={(open) => { if (!open) setEditPost(null) }}>
        <DialogContent className="rounded-none max-w-lg">
            <DialogHeader>
                <DialogTitle>Edit post</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
                <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Title"
                    className="rounded-none"
                />
                <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Content"
                    className="rounded-none min-h-32 resize-none"
                />
            </div>
            <DialogFoot className="gap-2 sm:gap-0">
                <Button variant="outline" className="rounded-none" onClick={() => setEditPost(null)}>
                    Cancel
                </Button>
                <Button
                    className="rounded-none"
                    disabled={isUpdating || !editContent.trim()}
                    onClick={() => {
                        if (!editPost) return
                        updatePost(
                            { postId: editPost.id, title: editTitle, content: editContent },
                            { onSuccess: () => setEditPost(null) }
                        )
                    }}
                >
                    {isUpdating ? "Saving..." : "Save"}
                </Button>
            </DialogFoot>
        </DialogContent>
    </Dialog>

    {/* Delete confirm dialog */}
    <Dialog open={!!deleteConfirmId} onOpenChange={(open) => { if (!open) setDeleteConfirmId(null) }}>
        <DialogContent className="rounded-none max-w-sm">
            <DialogHeader>
                <DialogTitle>Delete post?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
            <DialogFoot className="gap-2 sm:gap-0">
                <Button variant="outline" className="rounded-none" onClick={() => setDeleteConfirmId(null)}>
                    Cancel
                </Button>
                <Button
                    variant="destructive"
                    className="rounded-none"
                    disabled={isDeleting}
                    onClick={() => {
                        if (!deleteConfirmId) return
                        deletePost(deleteConfirmId, { onSuccess: () => setDeleteConfirmId(null) })
                    }}
                >
                    {isDeleting ? "Deleting..." : "Delete"}
                </Button>
            </DialogFoot>
        </DialogContent>
    </Dialog>
    </>
  )
}

export default CommunityPostList
