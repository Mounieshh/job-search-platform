import { applicationSchema, type ApplicationFormData } from "@/validate/application.zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useCreateJobApplication } from "@/hooks/mutations/profile"
import { uploadResumePdfToSupabase } from "@/lib/cloudinaryUpload"
import { useUserProfile } from "@/hooks/queries/profile"
import { X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

type ApplicationDrawerProps = {
    jobId: string
    onSuccess?: () => void
}

const ApplicationDrawer = ({ jobId, onSuccess }: ApplicationDrawerProps) => {

    const { mutateAsync: createApplication, isPending } = useCreateJobApplication()
    const { data: profileData } = useUserProfile()

    const profileResumeUrl = profileData?.profile?.resumeUrl || ""
    const [useProfileResume, setUseProfileResume] = useState(Boolean(profileResumeUrl))

    useEffect(() => {
        setUseProfileResume(Boolean(profileResumeUrl))
    }, [profileResumeUrl])

    const profileResumeLabel = useMemo(() => {
        if (!profileResumeUrl) return ""

        try {
            const name = decodeURIComponent(profileResumeUrl.split("/").pop() || "resume.pdf")
            return name.split("?")[0]
        } catch {
            return "resume.pdf"
        }
    }, [profileResumeUrl])

    const form = useForm<ApplicationFormData>({
        resolver: zodResolver(applicationSchema),
        defaultValues: {
            resume: undefined,
            githubLink: ""
        }
    })

    const onSubmit = async (values: ApplicationFormData) => {
        const usingProfileResume = useProfileResume && Boolean(profileResumeUrl)

        if (!usingProfileResume && !values.resume) {
            form.setError("resume", {
                message: "Resume is required",
            })
            return
        }

        const resumeUrl = usingProfileResume
            ? profileResumeUrl
            : await uploadResumePdfToSupabase(values.resume as File)

        await createApplication({
            jobId,
            resume: resumeUrl,
            githubLink: values.githubLink?.trim() || undefined,
        })

        form.reset({ resume: undefined, githubLink: "" })
        setUseProfileResume(Boolean(profileResumeUrl))
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
                                Resume
                            </FormLabel>

                            {useProfileResume && profileResumeUrl ? (
                                <div className="flex items-center justify-between rounded-md border border-input bg-muted/20 px-3 py-2 text-sm">
                                    <div className="min-w-0">
                                        <p className="truncate font-medium">{profileResumeLabel || "Profile resume"}</p>
                                        <p className="text-xs text-muted-foreground">Using resume from your profile</p>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 shrink-0"
                                        disabled={isPending}
                                        onClick={() => {
                                            setUseProfileResume(false)
                                            field.onChange(undefined)
                                        }}
                                    >
                                        <X className="size-4" />
                                    </Button>
                                </div>
                            ) : (
                                <FormControl>
                                    <Input
                                        type="file"
                                        accept=".pdf"
                                        disabled={isPending}
                                        onChange={e => {
                                            const file = e.target.files?.[0]
                                            field.onChange(file)
                                            if (file) form.clearErrors("resume")
                                        }}
                                        onBlur={field.onBlur}
                                        name={field.name}
                                        ref={field.ref}
                                        className="w-full"
                                    />
                                </FormControl>
                            )}

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