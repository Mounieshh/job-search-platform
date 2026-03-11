import { jobSchema, type JobFormData } from "@/validate/job.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
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
import { baseUrl } from "@/lib/base";


const textFields = [
  { name: "title",          label: "Job Title",        type: "text", placeholder: "Enter job title" },
  { name: "companyName",    label: "Company Name",     type: "text", placeholder: "Enter company name" },
  { name: "summary",        label: "Summary",          type: "text", placeholder: "Brief job summary" },
  { name: "description",    label: "Description",      type: "text", placeholder: "Job description" },
  { name: "url",            label: "Job URL",          type: "url",  placeholder: "https://example.com" },
  { name: "location",       label: "Location",         type: "text", placeholder: "City, Country" },
  { name: "salary",         label: "Salary",           type: "text", placeholder: "e.g. $50,000" },
  { name: "employmentType", label: "Employment Type",  type: "text", placeholder: "e.g. Full-time, Part-time" },
] as const;

// Reusable tag-input for string[] fields
const TagInput = ({
  label,
  placeholder,
  items,
  onAdd,
  onRemove,
  error,
}: {
  label: string;
  placeholder: string;
  items: string[];
  onAdd: (val: string) => void;
  onRemove: (index: number) => void;
  error?: string;
}) => {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setInput("");
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="rounded-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          className="rounded-none shrink-0"
          onClick={handleAdd}
        >
          Add
        </Button>
      </div>


      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-1 bg-muted text-muted-foreground text-xs px-2 py-1 rounded-sm"
            >
              {item}
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="hover:text-destructive transition-colors"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

const JobUploadForm = () => {
  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title:          "",
      companyName:    "",
      summary:        "",
      description:    "",
      url:            "",
      location:       "",
      salary:         "",
      employmentType: "",
      requirements:   [],
      duties:         [],
    },
  });

  const onSubmit = async (formData: JobFormData) => {
    try {
      const response = await fetch(`${baseUrl}/api/jobs/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Job not created");
      toast.success("Job Created Successfully");
      form.reset();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-3 sm:px-4">
      <div className="w-full max-w-xl">
        <div className="rounded-none border border-border bg-card p-5 sm:p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-card-foreground">Post a Job</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Fill in the details below to post a new job listing
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              {/* Text fields */}
              {textFields.map((field) => (
                <FormField
                  key={field.name}
                  name={field.name}
                  control={form.control}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel>{field.label}</FormLabel>
                      <FormControl>
                        <Input
                          {...f}
                          type={field.type}
                          placeholder={field.placeholder}
                          className="rounded-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              {/* Requirements */}
              <FormField
                name="requirements"
                control={form.control}
                render={({ field: f }) => (
                  <TagInput
                    label="Requirements"
                    placeholder="e.g. 3+ years React experience"
                    items={f.value}
                    onAdd={(val) => f.onChange([...f.value, val])}
                    onRemove={(i) => f.onChange(f.value.filter((_: string, idx: number) => idx !== i))}
                    error={form.formState.errors.requirements?.message}
                  />
                )}
              />

              {/* Duties */}
              <FormField
                name="duties"
                control={form.control}
                render={({ field: f }) => (
                  <TagInput
                    label="Duties"
                    placeholder="e.g. Build and maintain REST APIs"
                    items={f.value}
                    onAdd={(val) => f.onChange([...f.value, val])}
                    onRemove={(i) => f.onChange(f.value.filter((_: string, idx: number) => idx !== i))}
                    error={form.formState.errors.duties?.message}
                  />
                )}
              />

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