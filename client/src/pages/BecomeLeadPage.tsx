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
import { CheckCircle2, Clock, XCircle, Sparkles } from "lucide-react";

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

    const getStatusIcon = (s: string) => {
        switch (s) {
            case "approved": return <CheckCircle2 className="size-5 text-emerald-500" />;
            case "rejected": return <XCircle className="size-5 text-red-500" />;
            default: return <Clock className="size-5 text-amber-500" />;
        }
    };

    const getStatusColor = (s: string) => {
        switch (s) {
            case "approved": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
            case "rejected": return "bg-red-500/10 text-red-400 border-red-500/30";
            default: return "bg-amber-500/10 text-amber-400 border-amber-500/30";
        }
    };

    return (
        <div className="min-h-full bg-gradient-to-b from-background to-muted/30">
            <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
                <div className="mb-10 text-center sm:text-left">
                    <div className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-primary">
                        <Sparkles className="size-4" />
                        For verified users
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Become a company lead</h1>
                    <p className="mt-2 max-w-2xl text-muted-foreground">
                        Submit your company details. An administrator will review your request; you will be notified here when it is approved or rejected.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
                    <Card className="border-border shadow-md">
                        <CardHeader className="border-b border-border/60 pb-4">
                            <CardTitle>Application</CardTitle>
                            <CardDescription>Use your work email and the legal name of your organization.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                    <FormField
                                        control={form.control}
                                        name="companyName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Company name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Acme Corp" {...field} className="h-11" />
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
                                                <FormLabel>Work email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="you@company.com" {...field} className="h-11" />
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
                                                <FormLabel>Your role</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. HR Manager" {...field} className="h-11" />
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
                                                <FormLabel>Message (optional)</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Anything else we should know?"
                                                        {...field}
                                                        className="min-h-[100px] resize-none"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="submit"
                                        className="h-11 w-full font-semibold"
                                        disabled={isSubmitting || status?.status === "pending"}
                                    >
                                        {isSubmitting ? <Spinner className="mr-2 size-4" /> : null}
                                        {status?.status === "pending" ? "Request already submitted" : "Submit application"}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    <div>
                        <h2 className="mb-1 text-lg font-semibold">Your request status</h2>
                        <p className="mb-6 text-sm text-muted-foreground">
                            This page is for applicants only. Administrators review requests under <span className="font-medium text-foreground">Admin → Lead requests</span>.
                        </p>

                        {isStatusLoading ? (
                            <div className="flex justify-center py-20">
                                <Spinner className="size-8" />
                            </div>
                        ) : status ? (
                            <Card className="border-border shadow-md">
                                <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-4">
                                    <div>
                                        <CardTitle className="text-base">Latest request</CardTitle>
                                        <CardDescription>
                                            Submitted {new Date(status.createdAt).toLocaleString()}
                                        </CardDescription>
                                    </div>
                                    <Badge variant="outline" className={`gap-1.5 capitalize ${getStatusColor(status.status)}`}>
                                        {getStatusIcon(status.status)}
                                        {status.status}
                                    </Badge>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-6">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <p className="text-xs font-medium uppercase text-muted-foreground">Company</p>
                                            <p className="mt-1 font-medium">{status.companyName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium uppercase text-muted-foreground">Position</p>
                                            <p className="mt-1 font-medium">{status.position}</p>
                                        </div>
                                    </div>
                                    {status.adminComment ? (
                                        <div className="rounded-md border border-border bg-muted/40 p-4">
                                            <p className="text-xs font-medium uppercase text-muted-foreground">Note from admin</p>
                                            <p className="mt-1 text-sm">{status.adminComment}</p>
                                        </div>
                                    ) : null}
                                    {status.status === "approved" ? (
                                        <p className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm text-emerald-700 dark:text-emerald-400">
                                            You are approved as a lead. Sign out and sign in again if your role does not update immediately.
                                        </p>
                                    ) : null}
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-dashed">
                                <CardContent className="flex flex-col items-center py-14 text-center">
                                    <Clock className="mb-3 size-10 text-muted-foreground/50" />
                                    <p className="font-medium">No request yet</p>
                                    <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                        Complete the form on the left to send your application to the team.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
