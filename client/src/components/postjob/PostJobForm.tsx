import { postJobSchema, type PostJobFormData } from "@/validate/post.zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useCreatePostJob } from "@/hooks/mutations/postjob"


interface JobBasicDetailsProps {
    onNext: (jobId: string) => void
}

const PostJobForm = ({onNext}: JobBasicDetailsProps) => {

    const form = useForm({
        resolver: zodResolver(postJobSchema),
        defaultValues: {
            roleTitle: "",
            location: "",
            companyName: "",
            employmentType: ""
        }
    })

    const { mutateAsync: postNewJob } = useCreatePostJob()

    const onSubmit = async (formData: PostJobFormData) => {
        const response = await postNewJob(formData)
        onNext(response.jobId)
    }

    return (

        <>
        <div className="min-h-fit flex items-center justify-center px-4 py-10 bg-background">

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col w-full max-w-lg space-y-5 items-center"
                >
                    <section className="flex flex-col sm:flex-row gap-4 w-full">
                        <FormField
                            name="roleTitle"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <Input
                                            placeholder="Role you are hiring for..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="location"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <Input
                                            placeholder="Location..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </section>

                    <section className="flex flex-col space-y-4 w-full">
                        <FormField
                            name="employmentType"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="Employment type..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="companyName"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder="Company name..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </section>

                    <Button type="submit" className="w-full sm:w-1/2 rounded-full cursor-pointer" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Going through...": "Continue"}
                    </Button>
                </form>
            </Form>
        </div>
        </>
    )
}

export default PostJobForm