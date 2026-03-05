import { jobSchema, type JobFormData } from "@/validate/job.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";


const formFields = [
  { name: "title", label: "Job Title", type: "text", placeholder: "Enter job title" },
  { name: "companyName", label: "Company Name", type: "text", placeholder: "Enter company name" },
  { name: "description", label: "Description", type: "text", placeholder: "Job description", optional: true },
  { name: "url", label: "Job URL", type: "url", placeholder: "https://example.com", optional: true },
  { name: "location", label: "Location", type: "text", placeholder: "City, Country", optional: true },
  { name: "salary", label: "Salary", type: "text", placeholder: "e.g. $50,000", optional: true },
  { name: "source", label: "Source", type: "select", options: ["internal", "external"] },
];

const JobUploadForm = () => {
  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      description: "",
      companyName: "",
      url: "",
      location: "",
      salary: "",
      source: "internal",
    },
  });

  const onSubmit = async (formData: JobFormData) => {
    try {
      const response = await fetch("http://localhost:5000/api/jobs/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Job not created");
      toast.success("Job Created Successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center fixed inset-19">
      <div className="w-full max-w-lg">
        <div className="rounded-none border border-border bg-card p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-card-foreground">Post a Job</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Fill in the details below to post a new job listing
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {formFields.map((field) => (
                <FormField
                  key={field.name}
                  name={field.name as keyof JobFormData}
                  control={form.control}
                  render={({ field: controllerField }) => (
                    <FormItem>
                      <FormLabel>{field.label}</FormLabel>
                      <FormControl>
                        {field.type === "select" ? (
                          <Select
                            onValueChange={controllerField.onChange}
                            defaultValue={controllerField.value}
                          >
                            <SelectTrigger className="w-full rounded-none">
                              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options!.map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            {...controllerField}
                            type={field.type}
                            placeholder={field.placeholder}
                            className="rounded-none"
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <Button
                type="submit"
                className="w-full cursor-pointer rounded-none"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Posting..." : "Post Job"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default JobUploadForm;