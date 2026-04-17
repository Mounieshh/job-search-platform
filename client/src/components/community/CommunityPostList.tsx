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
    const [likingIds, setLikingIds] = useState<Set<string>>(new Set())
    const [searchText, setSearchText] = useState("")

    const isAdmin = user?.role === "ADMIN"

    const filteredJobs = useMemo(() => {
        const normalizedQuery = searchText.trim().toLowerCase()
        return data.filter((post) => {
            const combined = [post.title, post.content, post.user?.name]
                .filter(Boolean).join(" ").toLowerCase()
            return !normalizedQuery || combined.includes(normalizedQuery)
        })
    }, [data, searchText])

    const handleLike = async (postId: string) => {
        if (likingIds.has(postId)) return
        setLikingIds((prev) => new Set(prev).add(postId))
        try {
            await likePost(postId)
        } finally {
            setLikingIds((prev) => {
                const next = new Set(prev)
                next.delete(postId)
                return next
            })
        }
    }

    if (isPending) {
        return (
            <div className="flex justify-center items-center py-20">
                <Spinner className="size-7" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="rounded-lg border border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
                Sign in to see community posts.
            </div>
        )
    }

    return (
        <>
        <div className="space-y-4">
            <div className="flex items-end justify-between pb-3">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" aria-hidden="true" />
                    <label htmlFor="community-search" className="sr-only">Search posts</label>
                    <Input
                        id="community-search"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search by title, content, or author"
                        className="pl-9 h-10 w-full"
                    />
                </div>
            </div>

            {filteredJobs.length === 0 ? (
                <div className="rounded-lg border border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
                    {searchText ? "No posts match your search." : "No community posts yet. Be the first to share."}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredJobs.map((post) => {
                        const likedBy = post.likedBy ?? []
                        const hasLiked = Boolean(user?.id && likedBy.includes(user.id))
                        const likeCount = likedBy.length
                        const isLiking = likingIds.has(post.id)

                        return (
                        <Card key={post.id} className="overflow-hidden">
                            <CardHeader className="space-y-3 border-b border-border pb-4">

                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <img
                                            src={post.anonymousAvatar}
                                            alt="Avatar"
                                            className="size-9 rounded-full border object-cover shrink-0"
                                            height={36}
                                            width={36}
                                        />
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-card-foreground">
                                                {post.user?.name}
                                            </p>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <span>{formatVerificationStatus(post)}</span>
                                                <span>·</span>
                                                <span>{formatPostDate(post.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {(isAdmin || user?.id === post.postedUser) && (
                                        <div className="flex shrink-0 items-center gap-0.5">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 text-muted-foreground hover:text-foreground"
                                                aria-label="Edit post"
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
                                                className="h-9 w-9 text-muted-foreground hover:text-destructive"
                                                aria-label="Delete post"
                                                onClick={() => setDeleteConfirmId(post.id)}
                                            >
                                                <Trash2 className="size-3.5" />
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <CardTitle className="text-lg leading-snug">
                                    {post.title || "Untitled post"}
                                </CardTitle>
                                {post.isHiring && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full w-fit">
                                        <Briefcase className="size-3" aria-hidden="true" /> Hiring
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

                            <CardFooter className="border-t pt-3 pb-3">
                                <button
                                    onClick={() => handleLike(post.id)}
                                    disabled={isLiking}
                                    aria-label={hasLiked ? `Unlike post, ${likeCount} likes` : `Like post, ${likeCount} likes`}
                                    aria-pressed={hasLiked}
                                    className={[
                                        "group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 select-none",
                                        hasLiked
                                            ? "text-destructive bg-destructive/10 hover:bg-destructive/15"
                                            : "text-muted-foreground hover:text-destructive hover:bg-destructive/10",
                                        isLiking ? "opacity-60 cursor-not-allowed" : "cursor-pointer active:scale-95",
                                    ].join(" ")}
                                >
                                    <Heart
                                        className={[
                                            "size-4 transition-all duration-150",
                                            hasLiked ? "fill-destructive text-destructive scale-110" : "group-hover:scale-110",
                                            isLiking ? "animate-pulse" : "",
                                        ].join(" ")}
                                        aria-hidden="true"
                                    />
                                    <span className="tabular-nums">{likeCount}</span>
                                </button>
                            </CardFooter>
                        </Card>
                        )
                    })}
                </div>
            )}
        </div>

        {/* Read more dialog */}
        <Dialog open={!!selectedPost} onOpenChange={(open) => { if (!open) setSelectedPost(null) }}>
            <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-semibold">{selectedPost?.title}</DialogTitle>
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

        {/* Edit dialog */}
        <Dialog open={!!editPost} onOpenChange={(open) => { if (!open) setEditPost(null) }}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit post</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                    <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Title"
                    />
                    <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        placeholder="Content"
                        className="min-h-32 resize-none"
                    />
                </div>
                <DialogFoot className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => setEditPost(null)}>
                        Cancel
                    </Button>
                    <Button
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
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Delete post?</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
                <DialogFoot className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
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
