import { useState } from "react"
import { useCommunityPosts } from "@/hooks/queries/community"
import { useCreateCommunityPost, useDeleteCommunityPost, useUpdateCommunityPost } from "@/hooks/mutations/community"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Heart, Pencil, Trash2, Plus, ArrowLeft } from "lucide-react"
import { Link } from "react-router"
import { communitySchema, type CommunityFormData } from "@/validate/community.zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"

export default function AdminCommunityPage() {
  const { data = [], isPending, error } = useCommunityPosts()
  const { mutate: deletePost, isPending: isDeleting } = useDeleteCommunityPost()
  const { mutate: updatePost, isPending: isUpdating } = useUpdateCommunityPost()
  const { mutateAsync: createPost, isPending: isCreating } = useCreateCommunityPost()

  const [editPost, setEditPost] = useState<CommunityPostItem | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  const form = useForm<CommunityFormData>({
    resolver: zodResolver(communitySchema),
    defaultValues: { title: "", content: "", images: [], isHiring: false },
  })

  const handleCreate = async (data: CommunityFormData) => {
    try {
      await createPost(data)
      form.reset()
      setCreateOpen(false)
    } catch (e: any) {
      toast.error(e.message || "Failed to create post")
    }
  }

  if (isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="size-8 text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-sm text-destructive">Failed to load community posts.</div>
    )
  }

  return (
    <div className="w-full">
      <header className="sticky top-0 z-10 border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-foreground hover:bg-muted"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Community posts</h1>
              <p className="text-xs text-muted-foreground">{data.length} total posts</p>
            </div>
          </div>
          <Button size="sm" className="gap-1.5 rounded-none" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" /> New post
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {data.length === 0 ? (
          <div className="rounded-none border border-dashed border-border/60 bg-card py-14 text-center text-sm text-muted-foreground">
            No community posts yet.
          </div>
        ) : (
          <div className="overflow-hidden border border-border bg-card">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs uppercase text-muted-foreground">
                  <th className="px-4 py-3 font-medium sm:px-5">Post</th>
                  <th className="px-4 py-3 font-medium sm:px-5">Author</th>
                  <th className="px-4 py-3 font-medium sm:px-5">Likes</th>
                  <th className="px-4 py-3 font-medium sm:px-5">Date</th>
                  <th className="px-4 py-3 text-right font-medium sm:px-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((post) => (
                  <tr key={post.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-4 sm:px-5 max-w-xs">
                      <p className="font-medium text-foreground truncate">{post.title || "Untitled"}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{post.content}</p>
                      {post.isHiring && (
                        <Badge className="mt-1 rounded-full bg-green-100 text-green-700 hover:bg-green-100 text-[10px]">
                          Hiring
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-4 sm:px-5">
                      <p className="font-medium">{post.user?.name ?? "—"}</p>
                      <p className="text-xs text-muted-foreground">{post.user?.email ?? ""}</p>
                    </td>
                    <td className="px-4 py-4 sm:px-5">
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <Heart className="size-3.5" />
                        {post.likedBy?.length ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-4 sm:px-5 text-muted-foreground text-xs">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 sm:px-5">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-none gap-1"
                          onClick={() => {
                            setEditPost(post)
                            setEditTitle(post.title ?? "")
                            setEditContent(post.content)
                          }}
                        >
                          <Pencil className="size-3.5" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-none gap-1 border-red-200 text-destructive hover:bg-red-50"
                          onClick={() => setDeleteConfirmId(post.id)}
                        >
                          <Trash2 className="size-3.5" /> Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="rounded-none max-w-lg">
          <DialogHeader>
            <DialogTitle>New community post</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-3">
              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Title" className="rounded-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="content"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder="Content..." className="rounded-none min-h-32 resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="outline" className="rounded-none" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="rounded-none" disabled={isCreating}>
                  {isCreating ? "Posting..." : "Post"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
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
          <DialogFooter className="gap-2 sm:gap-0">
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
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => { if (!open) setDeleteConfirmId(null) }}>
        <DialogContent className="rounded-none max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete post?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
          <DialogFooter className="gap-2 sm:gap-0">
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
