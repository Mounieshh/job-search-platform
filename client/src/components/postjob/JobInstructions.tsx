import { ArrowLeft } from "lucide-react"
import { Button } from "../ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { postTiptapSchema, type PostTipTapData } from "@/validate/post.zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import TiptapEditor from "../tiptap/TiptapEditor"
import { usePatchPostJob } from "@/hooks/mutations/postjob"
import { toast } from "sonner"

interface JobInstructionsProps {
    onBack: () => void
    onPostJob?: () => void
    jobId: string | undefined
}

export default function JobInstructions({ onBack, onPostJob, jobId }: JobInstructionsProps) {
    const form = useForm({
        resolver: zodResolver(postTiptapSchema),
        defaultValues: {
            url: "",
            description: ""
        }
    })

    const { mutateAsync: patchJob } = usePatchPostJob()

    const onSubmit = async (formData: PostTipTapData) => {
        if (!jobId) {
            toast.error("Job ID is missing, please go back and try again")
            return
        }
        await patchJob({ formData, jobId })
        onPostJob?.()
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-5">
                    <FormField
                        name="url"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Job Link</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="input job url here.."
                                        {...field}
                                        className="w-[50%]"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <section>
                        <FormField
                            name="description"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <TiptapEditor onChange={field.onChange} initialContent={field.value} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </section>

                    <section className="flex flex-row gap-4 justify-between">
                        <Button type="button" className="cursor-pointer" onClick={onBack}>
                            <ArrowLeft className="size-4" /> Back
                        </Button>
                        <Button className="cursor-pointer" type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? "Submitting Data..." : "Post Job"}
                        </Button>
                    </section>
                </form>
            </Form>
        </>
    )
}