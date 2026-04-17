import { useMemo, useState } from "react"
import { useCommunityPosts } from "@/hooks/queries/community"
import { useCreateCommunityPost, useDeleteCommunityPost, useUpdateCommunityPost } from "@/hooks/mutations/community"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Heart, Pencil, Trash2, Plus, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { communitySchema, type CommunityFormData } from "@/validate/community.zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"

type SortKey = "title" | "author" | "likes" | "date"
type SortDir = "asc" | "desc"

const PAGE_SIZE_OPTIONS = [10, 20, 50]

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <ArrowUpDown className="ml-1.5 inline size-3.5 text-muted-foreground/50" aria-hidden="true" />
  return sortDir === "asc"
    ? <ArrowUp className="ml-1.5 inline size-3.5 text-primary" aria-hidden="true" />
    : <ArrowDown className="ml-1.5 inline size-3.5 text-primary" aria-hidden="true" />
}

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

  const [searchText, setSearchText] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("date")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const form = useForm<CommunityFormData>({
    resolver: zodResolver(communitySchema),
    defaultValues: { title: "", content: "", images: [], isHiring: false },
  })

  const handleCreate = async (formData: CommunityFormData) => {
    try {
      await createPost(formData)
      form.reset()
      setCreateOpen(false)
    } catch (e: any) {
      toast.error(e.message || "Failed to create post")
    }
  }

  const toggleSort = (col: SortKey) => {
    if (sortKey === col) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortKey(col); setSortDir("asc") }
    setPage(1)
  }

  const filtered = useMemo(() => {
    const q = searchText.trim().toLowerCase()
    return data.filter(post =>
      !q || [post.title, post.content, post.user?.name, post.user?.email]
        .join(" ").toLowerCase().includes(q)
    )
  }, [data, searchText])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortKey === "title") {
        const av = (a.title ?? "").toLowerCase()
        const bv = (b.title ?? "").toLowerCase()
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av)
      }
      if (sortKey === "author") {
        const av = (a.user?.name ?? "").toLowerCase()
        const bv = (b.user?.name ?? "").toLowerCase()
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av)
      }
      if (sortKey === "likes") {
        const av = a.likedBy?.length ?? 0
        const bv = b.likedBy?.length ?? 0
        return sortDir === "asc" ? av - bv : bv - av
      }
      // date
      const av = new Date(a.createdAt).getTime()
      const bv = new Date(b.createdAt).getTime()
      return sortDir === "asc" ? av - bv : bv - av
    })
  }, [filtered, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize)

  const handleSearch = (v: string) => { setSearchText(v); setPage(1) }
  const handlePageSize = (v: string) => { setPageSize(Number(v)); setPage(1) }

  const pageNumbers = useMemo(() => {
    const pages: (number | "ellipsis")[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (page > 3) pages.push("ellipsis")
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
      if (page < totalPages - 2) pages.push("ellipsis")
      pages.push(totalPages)
    }
    return pages
  }, [page, totalPages])

  if (isPending) return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner className="size-6 text-muted-foreground" />
    </div>
  )

  if (error) return (
    <div className="p-6 text-sm text-destructive">Failed to load community posts.</div>
  )

  const cols: { key: SortKey; label: string }[] = [
    { key: "title", label: "Post" },
    { key: "author", label: "Author" },
    { key: "likes", label: "Likes" },
    { key: "date", label: "Date" },
  ]

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Community posts</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {filtered.length} of {data.length} post{data.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-xs">
            <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              value={searchText}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search posts…"
              aria-label="Search community posts"
              className="pl-9 h-9"
            />
          </div>
          <Button size="sm" className="shrink-0 gap-1.5" onClick={() => setCreateOpen(true)}>
            <Plus aria-hidden="true" className="size-4" /> New post
          </Button>
        </div>
      </div>

      {/* Table */}
      {sorted.length === 0 ? (
        <div className="rounded-md border border-dashed border-border/60 bg-card py-14 text-center text-sm text-muted-foreground">
          {searchText ? `No posts match "${searchText}"` : "No community posts yet."}
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-md border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  {cols.map(({ key, label }) => (
                    <TableHead key={key} scope="col" className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleSort(key)}
                        className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={`Sort by ${label}`}
                      >
                        {label}
                        <SortIcon col={key} sortKey={sortKey} sortDir={sortDir} />
                      </button>
                    </TableHead>
                  ))}
                  <TableHead scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map(post => (
                  <TableRow key={post.id}>
                    <TableCell className="px-4 py-3 max-w-64">
                      <p className="font-medium text-foreground truncate">{post.title || "Untitled"}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{post.content}</p>
                      {post.isHiring && (
                        <Badge className="mt-1 rounded-full bg-primary/10 text-primary hover:bg-primary/10 text-[10px]">
                          Hiring
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <p className="font-medium text-foreground text-sm">{post.user?.name ?? "—"}</p>
                      <p className="text-xs text-muted-foreground">{post.user?.email ?? ""}</p>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-muted-foreground text-sm">
                        <Heart aria-hidden="true" className="size-3.5" />
                        {post.likedBy?.length ?? 0}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          aria-label={`Edit post: ${post.title || "Untitled"}`}
                          onClick={() => {
                            setEditPost(post)
                            setEditTitle(post.title ?? "")
                            setEditContent(post.content)
                          }}
                        >
                          <Pencil aria-hidden="true" className="size-3.5" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 border-destructive/30 text-destructive hover:bg-destructive/5"
                          aria-label={`Delete post: ${post.title || "Untitled"}`}
                          onClick={() => setDeleteConfirmId(post.id)}
                        >
                          <Trash2 aria-hidden="true" className="size-3.5" /> Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Rows per page</span>
              <Select value={String(pageSize)} onValueChange={handlePageSize}>
                <SelectTrigger size="sm" className="w-16 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map(n => (
                    <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>
                {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} of {sorted.length}
              </span>
            </div>

            {totalPages > 1 && (
              <Pagination className="mx-0 w-auto justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      aria-disabled={page === 1}
                      className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {pageNumbers.map((n, i) =>
                    n === "ellipsis" ? (
                      <PaginationItem key={`e-${i}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={n}>
                        <PaginationLink
                          isActive={n === page}
                          onClick={() => setPage(n)}
                          className="cursor-pointer"
                        >
                          {n}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      aria-disabled={page === totalPages}
                      className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </>
      )}

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
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
                      <Input placeholder="Title" {...field} />
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
                      <Textarea placeholder="Content…" className="min-h-32 resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isCreating}>{isCreating ? "Posting…" : "Post"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editPost} onOpenChange={open => { if (!open) setEditPost(null) }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit post</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              placeholder="Title"
              aria-label="Post title"
            />
            <Textarea
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              placeholder="Content"
              aria-label="Post content"
              className="min-h-32 resize-none"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setEditPost(null)}>Cancel</Button>
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
              {isUpdating ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteConfirmId} onOpenChange={open => { if (!open) setDeleteConfirmId(null) }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete post?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={() => {
                if (!deleteConfirmId) return
                deletePost(deleteConfirmId, { onSuccess: () => setDeleteConfirmId(null) })
              }}
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
