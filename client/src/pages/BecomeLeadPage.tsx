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
import { useActivateLeadPromotion } from "@/hooks/mutations/admin";
import { useLeadRequestStatus } from "@/hooks/queries/profile";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { CheckCircle2, Clock, ShieldCheck, XCircle, Building2, Mail, Briefcase } from "lucide-react";
import { useState } from "react";

export default function BecomeLeadPage() {
    const { data: status, isLoading: isStatusLoading } = useLeadRequestStatus();
    const { mutate: submitRequest, isPending: isSubmitting } = useCreateLeadRequest();
    const { mutate: activateLead, isPending: isActivating } = useActivateLeadPromotion();
    const [confirmActivate, setConfirmActivate] = useState(false);

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
            case "approved": return <CheckCircle2 className="size-4 text-emerald-500" />;
            case "rejected": return <XCircle className="size-4 text-red-500" />;
            default: return <Clock className="size-4 text-amber-500" />;
        }
    };

    const getStatusColor = (s: string) => {
        switch (s) {
            case "approved": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30";
            case "rejected": return "bg-red-500/10 text-red-500 border-red-500/30";
            default: return "bg-amber-500/10 text-amber-500 border-amber-500/30";
        }
    };

    return (
        <div className="min-h-150 mx-auto max-w-5xl px-4 sm:px-6 space-y-10">

            {/* Page header */}
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">Become a lead</h1>
                <p className="text-muted-foreground">
                    Leads are trusted hiring managers who post jobs and review applicants directly on the platform.
                </p>
            </div>

            <div className="grid gap-10 lg:grid-cols-2">

                {/* ── Left: Application form ── */}
                <div className="space-y-6">
                    <div className="space-y-1">
                        <h2 className="text-lg font-semibold">Application</h2>
                        <p className="text-sm text-muted-foreground">Use your work email and the legal name of your organization.</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                control={form.control}
                                name="companyName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-1.5">
                                            <Building2 className="size-3.5 text-muted-foreground" />
                                            Company name
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Acme Corp" {...field} className="h-11 rounded-none" />
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
                                        <FormLabel className="flex items-center gap-1.5">
                                            <Mail className="size-3.5 text-muted-foreground" />
                                            Work email
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="you@company.com" {...field} className="h-11 rounded-none" />
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
                                        <FormLabel className="flex items-center gap-1.5">
                                            <Briefcase className="size-3.5 text-muted-foreground" />
                                            Your role
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. HR Manager" {...field} className="h-11 rounded-none" />
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
                                        <FormLabel>Message <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Anything else we should know?"
                                                {...field}
                                                className="min-h-28 resize-none rounded-none"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="h-11 w-full rounded-none font-semibold"
                                disabled={isSubmitting || status?.status === "pending"}
                            >
                                {isSubmitting ? <Spinner className="mr-2 size-4" /> : null}
                                {isSubmitting
                                    ? "Submitting…"
                                    : status?.status === "pending"
                                    ? "Request already submitted"
                                    : "Submit application"}
                            </Button>
                        </form>
                    </Form>
                </div>

                {/* ── Right: Status + activation ── */}
                <div className="space-y-5">
                    <div className="space-y-1">
                        <h2 className="text-lg font-semibold">Your request status</h2>
                        <p className="text-sm text-muted-foreground">Track the progress of your lead application here.</p>
                    </div>

                    {isStatusLoading ? (
                        <div className="flex justify-center py-20">
                            <Spinner className="size-8" />
                        </div>
                    ) : status ? (
                        <div className="space-y-4">
                            {/* Status block */}
                            <div className="border border-border p-5 space-y-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-medium text-sm">Latest request</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Submitted {new Date(status.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <Badge variant="outline" className={["gap-1.5 capitalize shrink-0", getStatusColor(status.status)].join(" ")}>
                                        {getStatusIcon(status.status)}
                                        {status.status}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                                    <div>
                                        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Company</p>
                                        <p className="mt-1 text-sm font-medium">{status.companyName}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Position</p>
                                        <p className="mt-1 text-sm font-medium">{status.position}</p>
                                    </div>
                                </div>

                                {status.adminComment && (
                                    <div className="border border-border bg-muted/40 p-3 text-sm space-y-1">
                                        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Note from admin</p>
                                        <p>{status.adminComment}</p>
                                    </div>
                                )}

                                {status.status === "approved" && (
                                    <div className="bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-700">
                                        Your request is approved. Check your work email for the new credentials, then activate your lead account below.
                                    </div>
                                )}
                            </div>

                            {/* Activation block */}
                            {status.status === "approved" && (
                                <div className="border border-emerald-200 p-5 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="size-5 text-emerald-600 shrink-0" />
                                        <div>
                                            <p className="font-semibold text-sm">Activate lead account</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                Replaces your current login with the new credentials. You'll be logged out immediately.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
                                        Make sure you have received the credentials email before proceeding. Your old login will stop working.
                                    </div>

                                    {!confirmActivate ? (
                                        <Button
                                            variant="outline"
                                            className="w-full rounded-none border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                                            onClick={() => setConfirmActivate(true)}
                                        >
                                            I have the email — activate my lead account
                                        </Button>
                                    ) : (
                                        <div className="space-y-3">
                                            <p className="text-sm font-medium">Are you sure? This cannot be undone.</p>
                                            <div className="flex gap-3">
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 rounded-none"
                                                    onClick={() => setConfirmActivate(false)}
                                                    disabled={isActivating}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    className="flex-1 rounded-none bg-emerald-600 hover:bg-emerald-700 text-white"
                                                    disabled={isActivating}
                                                    onClick={() => activateLead()}
                                                >
                                                    {isActivating ? <Spinner className="mr-2 size-4" /> : null}
                                                    {isActivating ? "Activating…" : "Confirm & activate"}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="border border-dashed border-border p-10 flex flex-col items-center text-center space-y-2">
                            <Clock className="size-10 text-muted-foreground/40" />
                            <p className="font-medium">No request yet</p>
                            <p className="text-sm text-muted-foreground max-w-xs">
                                Complete the form on the left to send your application to the team.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
