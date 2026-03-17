import { useCreateJob } from "@/hooks/mutations/job"
import { useSession } from "@/hooks/queries/auth"
import { jobSchema, type JobFormData } from "@/validate/job.zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus } from "lucide-react"

export default function JobForm() {
  const { mutateAsync: postJob } = useCreateJob()
  const navigate = useNavigate()
  const { data: user } = useSession()

  const form = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      companyName: "",
      summary: "",
      description: "",
      url: "",
      location: "",
      salary: "",
      employmentType: "",
      requirements: [],
      duties: []
    }
  })

  const { fields: reqFields, append: addReq, remove: removeReq } = useFieldArray({
    control: form.control,
    name: "requirements" as never
  })

  const { fields: dutyFields, append: addDuty, remove: removeDuty } = useFieldArray({
    control: form.control,
    name: "duties" as never
  })

  const onSubmit = async (formData: JobFormData) => {
    try {
      await postJob(formData)
      toast.success("Job Created Successfully..")
      form.reset()
      if (user?.role === "USER") {
        navigate("/my-posts")
      } else {
        navigate("/joblistings")
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

          {/* Job Info Section */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest font-mono">
              Job Info
            </h2>

            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Frontend Developer" {...field} className="rounded-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Two column row */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="companyName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Google" {...field} className="rounded-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="employmentType"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-none w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="full_time">Full Time</SelectItem>
                        <SelectItem value="part_time">Part Time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              name="summary"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief summary of the job..."
                      {...field}
                      rows={3}
                      className="rounded-none resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Full job description..."
                      {...field}
                      rows={5}
                      className="rounded-none resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest font-mono">
              Details
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="location"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Remote" {...field} className="rounded-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="salary"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 80000" {...field} className="rounded-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              name="url"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} className="rounded-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Requirements Section */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-widest font-mono">
              Requirements
            </h2>

            {reqFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <FormField
                  name={`requirements.${index}`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="e.g. 3+ years React experience" {...field} className="rounded-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeReq(index)}
                  className="rounded-none shrink-0"
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addReq("")}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="size-3" />
              Add requirement
            </button>
          </div>

          {/* Duties Section */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-widest font-mono">
              Duties
            </h2>

            {dutyFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <FormField
                  name={`duties.${index}`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="e.g. Build reusable components" {...field} className="rounded-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeDuty(index)}
                  className="rounded-none shrink-0"
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addDuty("")}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="size-3" />
              Add duty
            </button>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t pt-5">
            <Button
              type="button"
              variant="outline"
              className="rounded-none cursor-pointer"
              onClick={() => form.reset()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-none cursor-pointer"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Posting..." : "Post Job"}
            </Button>
          </div>

        </form>
      </Form>
    </div>
  )
}