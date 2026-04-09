import { communitySchema, type CommunityFormData } from "@/validate/community.zod"
import { useCreateCommunityPost } from "@/hooks/mutations/community"
import { zodResolver } from "@hookform/resolvers/zod"
import { type SubmitHandler, useForm } from "react-hook-form"
import { useEffect, useMemo, useState } from "react"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ImageIcon, X, Briefcase } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { useSession } from "@/hooks/queries/auth"

const CommunityPost = () => {
  const { mutateAsync: createPost, isPending } = useCreateCommunityPost()
  const { data: user } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<CommunityFormData>({
    resolver: zodResolver(communitySchema),
    defaultValues: {
      title: "",
      content: "",
      images: [],
      isHiring: false
    }
  })

  const selectedImages = form.watch("images") || []
  const previewUrls = useMemo(() => {
    return selectedImages.map((file) => URL.createObjectURL(file))
  }, [selectedImages])

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [previewUrls])

  const handleCommunityPost: SubmitHandler<CommunityFormData> = async (formData) => {
    try {
      await createPost(formData)
      toast.success("Post shared with the community")
      form.reset({ title: "", content: "", images: [], isHiring: false })
      setIsOpen(false)
    } catch (error: any) {
      toast.error(error.message || "Unable to create the community post")
    }
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="group cursor-pointer rounded-lg border border-border/50 bg-linear-to-br from-background to-background/80 p-4 transition-all hover:border-border hover:shadow-sm">
            <div className="flex items-center gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-background/50 group-hover:bg-background">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span>Share your thoughts with the community...</span>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-background p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCommunityPost)} className="space-y-6">
              <div className="space-y-2 border-b border-border/30 pb-4">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Post Title
                </label>
                <FormField
                  name="title"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <Input
                          placeholder="What's on your mind?"
                          className="border-0 bg-transparent px-0 text-lg font-medium placeholder:text-muted-foreground/40 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Your Thoughts
                  </label>
                  <span className="text-xs text-muted-foreground/60">
                    {form.watch("content").length} characters
                  </span>
                </div>
                <FormField
                  name="content"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <Textarea
                          placeholder="Share your thoughts, ideas, and insights with the community..."
                          rows={6}
                          className="resize-none rounded-lg border-border/50 bg-background/50 px-4 py-3 placeholder:text-muted-foreground/40 focus-visible:ring-1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-3 border-t border-border/30 pt-4">
                <FormField
                  name="images"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <label htmlFor="community-images" className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background/50 hover:bg-background">
                          <ImageIcon className="h-4 w-4" />
                        </div>
                        <span>Add images</span>
                        {previewUrls.length > 0 && (
                          <span className="ml-auto text-xs bg-background/50 px-2 py-1 rounded">
                            {previewUrls.length} image{previewUrls.length !== 1 ? 's' : ''}
                          </span>
                        )}
                      </label>

                      {previewUrls.length > 0 && (
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                            {previewUrls.map((url, index) => (
                              <div
                                key={`${url}-${index}`}
                                className="group relative aspect-square overflow-hidden rounded-lg border border-border/50 bg-background/50"
                              >
                                <img
                                  src={url}
                                  alt={`Selected preview ${index + 1}`}
                                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newImages = selectedImages.filter((_, i) => i !== index)
                                    field.onChange(newImages)
                                  }}
                                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                                >
                                  <X className="h-4 w-4 text-white" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <FormControl>
                        <Input
                          id="community-images"
                          type="file"
                          multiple
                          accept="image/*"
                          ref={field.ref}
                          name={field.name}
                          onBlur={field.onBlur}
                          onChange={(e) => field.onChange(Array.from(e.target.files || []))}
                          className="hidden"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-2 border-t border-border/30 pt-4 sm:justify-end">
                {user?.role === "LEAD" && (
                    <FormField
                        name="isHiring"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormControl>
                                    <button
                                        type="button"
                                        onClick={() => field.onChange(!field.value)}
                                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm border transition-colors ${
                                            field.value
                                                ? "bg-green-50 border-green-200 text-green-700"
                                                : "border-border text-muted-foreground hover:text-foreground"
                                        }`}
                                    >
                                        <Briefcase className="size-3.5" />
                                        {field.value ? "Hiring" : "Mark as hiring"}
                                    </button>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 sm:flex-none"
                >
                  {isPending ? "Sharing..." : "Share Post"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CommunityPost
