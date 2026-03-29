import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadRequestSchema } from "@/validate/lead.zod";
import type { LeadRequestFormData } from "@/validate/lead.zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateLeadRequest } from "@/hooks/mutations/profile";
import { useLeadRequestStatus } from "@/hooks/queries/profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

export default function BecomeLeadPage() {
    const { data: status, isLoading: isStatusLoading } = useLeadRequestStatus();
    const { mutate: submitRequest, isPending: isSubmitting } = useCreateLeadRequest();

    const form = useForm<LeadRequestFormData>({
        resolver: zodResolver(leadRequestSchema),
        defaultValues: {
            companyName: "",
            companyEmail: "",
            position: "",
            message: "",
        },
    });

    const onSubmit = (data: LeadRequestFormData) => {
        submitRequest(data);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "approved": return <CheckCircle2 className="size-5 text-green-500" />;
            case "rejected": return <XCircle className="size-5 text-red-500" />;
            default: return <Clock className="size-5 text-yellow-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "approved": return "bg-green-500/10 text-green-500 border-green-500/20";
            case "rejected": return "bg-red-500/10 text-red-500 border-red-500/20";
            default: return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left Side: Form */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Become a Lead</h1>
                        <p className="text-muted-foreground mt-2">
                            Apply to become a lead and start approving jobs for your company.
                        </p>
                    </div>

                    <Card className="border-border/40 shadow-sm rounded-none">
                        <CardHeader>
                            <CardTitle>Request Form</CardTitle>
                            <CardDescription>Enter your professional details below.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                    <FormField
                                        control={form.control}
                                        name="companyName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Company Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Google" {...field} className="rounded-none h-11" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="companyEmail"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Professional Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="you@company.com" {...field} className="rounded-none h-11" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="position"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Position</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. HR Manager" {...field} className="rounded-none h-11" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Message (Optional)</FormLabel>
                                                <FormControl>
                                                    <Textarea 
                                                        placeholder="Why do you want to become a lead?" 
                                                        {...field} 
                                                        className="rounded-none min-h-25 resize-none"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button 
                                        type="submit" 
                                        className="w-full h-11 rounded-none font-semibold transition-all active:scale-[0.98]" 
                                        disabled={isSubmitting || status?.status === 'pending'}
                                    >
                                        {isSubmitting ? <Spinner className="mr-2" /> : null}
                                        {status?.status === 'pending' ? 'Already Requested' : 'Submit Request'}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Side: Status */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Request Status</h2>
                        <p className="text-muted-foreground mt-2">
                            Track the progress of your application.
                        </p>
                    </div>

                    {isStatusLoading ? (
                        <div className="flex justify-center py-20">
                            <Spinner className="size-8" />
                        </div>
                    ) : status ? (
                        <Card className="border-border/40 shadow-sm rounded-none border-l-4 border-l-primary/50">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">Recent Request</CardTitle>
                                    <Badge variant="outline" className={`px-2.5 py-0.5 rounded-full border ${getStatusColor(status.status)}`}>
                                        <span className="flex items-center gap-1.5 capitalize">
                                            {getStatusIcon(status.status)}
                                            {status.status}
                                        </span>
                                    </Badge>
                                </div>
                                <CardDescription>
                                    Submitted on {new Date(status.createdAt).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 py-3 border-y border-border/40">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Company</p>
                                        <p className="font-medium">{status.companyName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Position</p>
                                        <p className="font-medium">{status.position}</p>
                                    </div>
                                </div>
                                {status.adminComment && (
                                    <div className="bg-muted px-4 py-3 border-l-2 border-primary/30">
                                        <p className="text-xs text-muted-foreground font-bold mb-1">Admin Feedback</p>
                                        <p className="text-sm italic">"{status.adminComment}"</p>
                                    </div>
                                )}
                                {status.status === 'approved' && (
                                    <p className="text-sm text-green-600 bg-green-50 p-3 border border-green-100 italic">
                                        Congratulations! You are now a Lead. Please logout and login again to see changes.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-muted/30 border border-dashed border-border/60 text-center px-10">
                            <Clock className="size-10 text-muted-foreground/40 mb-4" />
                            <h3 className="font-semibold text-lg">No Request Found</h3>
                            <p className="text-sm text-muted-foreground">
                                You haven't submitted any requests to become a lead yet. Use the form on the left to get started.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
