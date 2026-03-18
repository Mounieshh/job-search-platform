import { communitySchema, type CommunityFormData } from "@/validate/community.zod"
import { useCreateCommunityPost } from "@/hooks/mutations/community"
import { zodResolver } from "@hookform/resolvers/zod"
import { type SubmitHandler, useForm } from "react-hook-form"
import { useEffect, useMemo } from "react"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ImageIcon, PlusIcon } from "lucide-react"

const CommunityPost = () => {
  const { mutateAsync: createPost, isPending } = useCreateCommunityPost()

  const form = useForm<CommunityFormData>({
    resolver: zodResolver(communitySchema),
    defaultValues: {
      title: "",
      content: "",
      images: []
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
      toast.success("Community post created")
      form.reset({ title: "", content: "", images: [] })
    } catch (error: any) {
      toast.error(error.message || "Unable to create the community post")
    }
  }

  return (
    <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCommunityPost)} className="space-y-5">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    Title
                  </div>
                  <FormControl>
                    <Input
                      placeholder="Add a short title"
                      className="rounded-none border-0 border-b px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <div className="flex items-center justify-between gap-3 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    <span>Post Content</span>
                    <span>{field.value.length} chars</span>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Share your thoughts here..."
                      rows={8}
                      className="resize-none rounded-none border-0 border-b px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="images"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <div className="">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <label htmlFor="community-images" className="flex cursor-pointer items-center gap-2 text-sm font-medium hover:text-foreground transition-colors">
                          <ImageIcon className="size-5" />
                          <span><PlusIcon className="size-4"/></span>
                        </label>
                        {previewUrls.length > 0 && (
                          <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                            {previewUrls.length} selected
                          </span>
                        )}
                      </div>

                      <Button type="submit" className="rounded-none cursor-pointer" disabled={isPending}>
                        {isPending ? "Posting..." : "Post"}
                      </Button>
                    </div>

                    {previewUrls.length > 0 ? (
                      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                        {previewUrls.map((url, index) => (
                          <img
                            key={`${url}-${index}`}
                            src={url}
                            alt={`Selected preview ${index + 1}`}
                            className="h-20 w-full rounded border object-cover"
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-xs text-muted-foreground">
                        Images are optional. Add a few if they help explain the post.
                      </p>
                    )}
                  </div>

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
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      
  </div>
        
  )
}

export default CommunityPost