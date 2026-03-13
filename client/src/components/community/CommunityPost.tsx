import { communitySchema, type CommunityFormData } from "@/validate/community.zod"
import { useCreateCommunityPost } from "@/hooks/mutations/useCreateCommunityPost"
import { zodResolver } from "@hookform/resolvers/zod"
import { type SubmitHandler, useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { Textarea } from "../ui/textarea"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { toast } from "sonner"

const CommunityPost = () => {
  const { mutateAsync: createPost, isPending } = useCreateCommunityPost()

  const form = useForm<CommunityFormData>({
    resolver: zodResolver(communitySchema),
    defaultValues: {
      content: "",
      images: []
    }
  })


  const handleCommunityPost: SubmitHandler<CommunityFormData> = async (formData) => {
    try {
      await createPost(formData)

      toast.success("Community post created")
      form.reset({ content: "", images: [] })

    } catch (error: any) {
        toast.error(error.message || "Unable to create the community post")
    }
  }

  return (
    <>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCommunityPost)} className="flex flex-col space-y-5">

              <FormField
              name="content"
              control={form.control}
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                    placeholder="Share your thoughts here.."
                    {...field}
                    rows={5}
                    className="resize-none rounded-none"
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
                <FormItem>
                  <FormControl>
                    <Input
                    type="file"
                    multiple
                    accept="image/*"
                    name={field.name}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    onChange={(e) => field.onChange(Array.from(e.target.files || []))}
                    className="rounded-none"
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
              />


              <Button type="submit" className="rounded-none cursor-pointer" disabled={isPending}>
                {isPending ? "Posting..." : "Submit"}
              </Button>
          </form>
        </Form>
      </div>
    </>
  )
}

export default CommunityPost