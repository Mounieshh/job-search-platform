import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postTiptapSchema, type PostTipTapData } from "@/validate/post.zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import TiptapEditor from "../tiptap/TiptapEditor";
import { usePatchPostJob } from "@/hooks/mutations/postjob";
import { toast } from "sonner";

interface JobInstructionsProps {
    onBack: () => void;
    onPostJob?: () => void;
    jobId: string | undefined;
}

export default function JobInstructions({ onBack, onPostJob, jobId }: JobInstructionsProps) {
    
    const form = useForm<PostTipTapData>({
        resolver: zodResolver(postTiptapSchema),
        defaultValues: {
            url: "",
            description: ""
        },
        mode: "onChange"   // Optional: helps with real-time validation
    });

    const { mutateAsync: patchJob } = usePatchPostJob();

    const onSubmit = async (formData: PostTipTapData) => {
        if (!jobId) {
            toast.error("Job ID is missing, please go back and try again");
            return;
        }

        try {
            await patchJob({ formData, jobId });
            toast.success("Job posted successfully!");
            onPostJob?.();
        } catch (error) {
            toast.error("Failed to post job. Please try again.");
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-6">
                
                {/* Job Link Field */}
                <FormField
                    name="url"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Job Link</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="https://example.com/job/..."
                                    {...field}
                                    className="w-[50%]"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Tiptap Editor Field */}
                <FormField
                    name="description"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Job Description</FormLabel>
                            <FormControl>
                                <TiptapEditor 
                                    value={field.value || ""} 
                                    onChange={field.onChange} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Action Buttons */}
                <div className="flex flex-row gap-4 justify-between pt-4">
                    <Button 
                        type="button" 
                        variant="outline"
                        onClick={onBack}
                    >
                        <ArrowLeft className="size-4 mr-2" /> 
                        Back
                    </Button>
                    
                    <Button 
                        type="submit" 
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? "Submitting..." : "Post Job"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}