import { applicationSchema, type ApplicationFormData } from "@/validate/application.zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useCreateJobApplication } from "@/hooks/mutations/profile"
import { uploadResumePdfToCloudinary } from "@/lib/cloudinaryUpload"

type ApplicationDrawerProps = {
    jobId: string
    onSuccess?: () => void
}

const ApplicationDrawer = ({ jobId, onSuccess }: ApplicationDrawerProps) => {

    const { mutateAsync: createApplication, isPending } = useCreateJobApplication()

    const form = useForm<ApplicationFormData>({
        resolver: zodResolver(applicationSchema),
        defaultValues: {
            resume: undefined,
            githubLink: ""
        }
    })

    const onSubmit = async (values: ApplicationFormData) => {
        const resumeUrl = await uploadResumePdfToCloudinary(values.resume)

        await createApplication({
            jobId,
            resume: resumeUrl,
            githubLink: values.githubLink?.trim() || undefined,
        })

        form.reset({ resume: undefined, githubLink: "" })
        onSuccess?.()

    }

    return (
        <div className="w-full max-w-2xl mx-auto">
        <Form {...form}>
            
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                    name="resume"
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Upload your resume
                            </FormLabel>
                            <FormControl>
                                <Input
                                type="file"
                                accept=".pdf"
                                disabled={isPending}
                                onChange={e => {
                                    const file = e.target.files?.[0];
                                    field.onChange(file);
                                }}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                className="w-full"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                name="githubLink"
                control={form.control}
                render={({field}) => (
                    <FormItem>
                        <FormLabel>
                            Github Link (Optional)
                        </FormLabel>
                        <FormControl>
                            <Input
                            placeholder="Github link here..."
                            disabled={isPending}
                            {...field}
                            className="w-full"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />

                <Button type="submit" disabled={isPending} className="cursor-pointer w-full sm:w-auto">
                    {isPending ? "Submitting..." : "Submit Application"}
                </Button>
            </form>

        </Form>
    </div>
  )
}

export default ApplicationDrawer