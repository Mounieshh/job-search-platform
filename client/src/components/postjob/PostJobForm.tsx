import { postJobSchema, type PostJobFormData } from "@/validate/post.zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useCreatePostJob } from "@/hooks/mutations/postjob"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useLeadRequestStatus } from "@/hooks/queries/profile"
import { useEffect } from "react"
import { Lock } from "lucide-react"

interface JobBasicDetailsProps {
    onNext: (jobId: string) => void
}

const PostJobForm = ({onNext}: JobBasicDetailsProps) => {
    const { data: leadStatus } = useLeadRequestStatus()
    const isApprovedLead = leadStatus?.status === "approved"

    const form = useForm({
        resolver: zodResolver(postJobSchema),
        mode: "onChange",
        defaultValues: {
            roleTitle: "",
            location: "",
            companyName: "",
            employmentType: ""
        }
    })

    // Pre-fill and lock company name once lead status loads
    useEffect(() => {
        if (isApprovedLead && leadStatus?.companyName) {
            form.setValue("companyName", leadStatus.companyName, { shouldValidate: true })
        }
    }, [isApprovedLead, leadStatus?.companyName, form])

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
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Employment Type"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="Full_Time">Full Time</SelectItem>
                                                    <SelectItem value="Part_Time">Part Time</SelectItem>
                                                    <SelectItem value="Contract">Contract</SelectItem>
                                                    <SelectItem value="Internship">Intership</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
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
                                        <div className="relative">
                                            <Input
                                                placeholder="Company name..."
                                                {...field}
                                                readOnly={isApprovedLead}
                                                className={isApprovedLead ? "pr-9 bg-muted text-muted-foreground cursor-not-allowed" : ""}
                                            />
                                            {isApprovedLead && (
                                                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                                            )}
                                        </div>
                                    </FormControl>
                                    {isApprovedLead && (
                                        <p className="text-xs text-muted-foreground">
                                            Locked to your verified company — {leadStatus?.companyEmail}
                                        </p>
                                    )}
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