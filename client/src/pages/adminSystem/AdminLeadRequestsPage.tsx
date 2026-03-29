import { useAdminLeadRequests } from "@/hooks/queries/admin";
import { useAdminReviewLeadRequest } from "@/hooks/mutations/admin";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { User, Mail, Briefcase, Building2, Check, X } from "lucide-react";

export default function AdminLeadRequestsPage() {
    const { data: requests, isLoading } = useAdminLeadRequests();
    const { mutate: reviewRequest, isPending: isReviewing } = useAdminReviewLeadRequest();
    const [adminComments, setAdminComments] = useState<{ [key: string]: string }>({});

    const handleReview = (requestId: string, action: 'approve' | 'reject') => {
        reviewRequest({
            requestId,
            action,
            adminComment: adminComments[requestId] || ""
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Spinner className="size-8" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Lead Requests</h1>
                <p className="text-muted-foreground mt-1">Review and approve users who want to become company leads.</p>
            </div>

            {requests && requests.length > 0 ? (
                <div className="grid gap-6">
                    {requests.map((request: any) => (
                        <Card key={request._id} className="border-border/40 shadow-sm rounded-none border-l-4 border-l-primary/50">
                            <CardHeader className="pb-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <CardTitle className="text-xl flex items-center gap-2">
                                            <Building2 className="size-5 text-primary" />
                                            {request.companyName}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-4 mt-2">
                                            <span className="flex items-center gap-1.5"><User className="size-3.5" /> {request.userId?.name}</span>
                                            <span className="flex items-center gap-1.5"><Mail className="size-3.5" /> {request.companyEmail}</span>
                                        </CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="rounded-none border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                            onClick={() => handleReview(request._id, 'reject')}
                                            disabled={isReviewing}
                                        >
                                            <X className="mr-2 size-4" /> Reject
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            className="rounded-none px-6"
                                            onClick={() => handleReview(request._id, 'approve')}
                                            disabled={isReviewing}
                                        >
                                            <Check className="mr-2 size-4" /> Approve
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-0">
                                <div className="bg-muted/30 p-4 border border-border/40 space-y-3">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Position</p>
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="size-4 text-muted-foreground" />
                                            <span className="font-medium text-sm">{request.position}</span>
                                        </div>
                                    </div>
                                    {request.message && (
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Applicant Message</p>
                                            <p className="text-sm text-gray-600 italic">"{request.message}"</p>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold">Admin Comment (Optional)</p>
                                    <Textarea 
                                        placeholder="Add a feedback for the user..."
                                        className="rounded-none resize-none min-h-20"
                                        value={adminComments[request._id] || ""}
                                        onChange={(e) => setAdminComments({ ...adminComments, [request._id]: e.target.value })}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-muted/20 border border-dashed border-border/60 rounded-none">
                    <p className="text-muted-foreground">No pending lead requests found.</p>
                </div>
            )}
        </div>
    );
}
