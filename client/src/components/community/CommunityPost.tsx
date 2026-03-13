import { communitySchema, type CommunityFormData } from "@/validate/community.zod"
import { useCreateCommunityPost } from "@/hooks/mutations/useCreateCommunityPost"
import { zodResolver } from "@hookform/resolvers/zod"
import { type SubmitHandler, useForm } from "react-hook-form"
import { useEffect, useMemo } from "react"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { Textarea } from "../ui/textarea"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { Card, CardContent } from "../ui/card"
import { ImageIcon } from "lucide-react"

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
    <>
      <div>
        <Card className="rounded-none">
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCommunityPost)} className="space-y-4">
                <FormField
                name="title"
                control={form.control}
                render={({field}) => (
                  <FormItem>
                    <FormControl>
                      <Input
                      placeholder="Title"
                      className="rounded-none border-0 border-b px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      {...field}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
                />

                <FormField
                name="content"
                control={form.control}
                render={({field}) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <Textarea
                      placeholder="Share your thoughts here.."
                      value={field.value}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      onChange={field.onChange}
                      rows={8}
                      className="resize-none rounded-none border-0 border-b px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
                />

                <FormField
                name="images"
                control={form.control}
                render={({field}) => (
                  <FormItem className="space-y-3">
                    <div className="flex items-center justify-between pt-3">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <label htmlFor="community-images" className="cursor-pointer">
                          <ImageIcon className="size-5" />
                        </label>
                        {previewUrls.length > 0 ? (
                          <div className="flex items-center gap-2">
                            {previewUrls.map((url, index) => (
                              <img
                              key={`${url}-${index}`}
                              src={url}
                              alt={`Selected preview ${index + 1}`}
                              className="size-8 rounded border object-cover"
                              />
                            ))}
                          </div>
                        ) : null}
                      </div>
                      <Button type="submit" className="rounded-none cursor-pointer" disabled={isPending}>
                        {isPending ? "Posting..." : "Post"}
                      </Button>
                    </div>

                    <FormControl>
                      <Input
                      id="community-images"
                      type="file"
                      multiple
                      accept="image/*"
                      name={field.name}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      onChange={(e) => field.onChange(Array.from(e.target.files || []))}
                      className="hidden"
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default CommunityPost