import { useAdminLeadRequests } from "@/hooks/queries/admin";
import { useAdminReviewLeadRequest } from "@/hooks/mutations/admin";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Link } from "react-router";
import { User, Mail, Briefcase, Building2, Check, X, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type LeadReq = LeadRequest & { _id: string };

export default function AdminLeadRequestsPage() {
  const { data: requests, isLoading } = useAdminLeadRequests();
  const { mutate: reviewRequest, isPending: isReviewing } = useAdminReviewLeadRequest();
  const [comments, setComments] = useState<Record<string, string>>({});
  const [dialog, setDialog] = useState<{
    request: LeadReq | null;
    action: "approve" | "reject" | null;
  }>({ request: null, action: null });

  const pending = (requests ?? []) as LeadReq[];

  const submitReview = () => {
    if (!dialog.request || !dialog.action) return;
    reviewRequest(
      {
        requestId: dialog.request._id,
        action: dialog.action,
        adminComment: comments[dialog.request._id] ?? "",
      },
      {
        onSettled: () => setDialog({ request: null, action: null }),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <header className="sticky top-0 z-10 border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link
            to="/admin"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-foreground hover:bg-muted"
            aria-label="Back to admin"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">Lead requests</h1>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">

        {pending.length === 0 ? (
          <div className="rounded-none border border-dashed border-border/60 bg-card py-14 text-center">
            <p className="text-sm text-muted-foreground">No pending lead requests.</p>
            <Link to="/admin" className="mt-4 inline-block text-sm text-primary hover:underline">
              Back to dashboard
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-none border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead>
                  <tr className="bg-muted/30 text-xs uppercase text-muted-foreground">
                    <th className="px-4 py-3 font-medium sm:px-5">Applicant</th>
                    <th className="px-4 py-3 font-medium sm:px-5">Company</th>
                    <th className="px-4 py-3 font-medium sm:px-5">Work email</th>
                    <th className="px-4 py-3 font-medium sm:px-5">Role</th>
                    <th className="px-4 py-3 font-medium sm:px-5">Submitted</th>
                    <th className="px-4 py-3 text-right font-medium sm:px-5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((request) => (
                    <tr key={request._id} className="border-t border-border">
                      <td className="px-4 py-4 sm:px-5">
                        <div className="flex items-center gap-2 font-medium">
                          <User className="size-4 text-muted-foreground" />
                          {request.userId?.name ?? "—"}
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          ID: {String(request.userId?._id ?? "").slice(-8)}
                        </p>
                      </td>
                      <td className="px-4 py-4 sm:px-5">
                        <div className="flex items-center gap-2 text-foreground">
                          <Building2 className="size-4 text-primary" />
                          {request.companyName}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground sm:px-5">
                        <span className="flex items-center gap-1.5">
                          <Mail className="size-3.5 text-muted-foreground" />
                          {request.companyEmail}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground sm:px-5">
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="size-3.5 text-muted-foreground" />
                          {request.position}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground sm:px-5">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 sm:px-5">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-none border-red-200 text-destructive hover:bg-red-50"
                            onClick={() => setDialog({ request, action: "reject" })}
                            disabled={isReviewing}
                          >
                            <X className="mr-1 size-3.5" />
                            Reject
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={() => setDialog({ request, action: "approve" })}
                            disabled={isReviewing}
                          >
                            <Check className="mr-1 size-3.5" />
                            Approve
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}
      </div>

      <Dialog open={!!dialog.request && !!dialog.action} onOpenChange={() => setDialog({ request: null, action: null })}>
        <DialogContent className="max-w-md rounded-none border border-border bg-card text-foreground sm:rounded-none">
          <DialogHeader>
            <DialogTitle>
              {dialog.action === "approve" ? "Approve lead request" : "Reject lead request"}
            </DialogTitle>
            <DialogDescription>
              {dialog.request ? (
                <>
                  <span className="font-medium">{dialog.request.userId?.name}</span>
                  {" → "}
                  <span className="text-primary">{dialog.request.companyName}</span>
                </>
              ) : null}
            </DialogDescription>
          </DialogHeader>

          {dialog.request?.message ? (
            <div className="rounded-none border border-border bg-muted/30 p-3 text-sm">
              <p className="text-xs font-medium uppercase text-muted-foreground">Applicant message</p>
              <p className="mt-1">{dialog.request.message}</p>
            </div>
          ) : null}

          <div className="space-y-2">
            <label className="text-xs font-medium uppercase text-muted-foreground">Admin note</label>
            <Textarea
              className="min-h-[88px] rounded-none border-border bg-background"
              placeholder={
                dialog.action === "reject" ? "Reason for rejection (recommended)" : "Optional message to the applicant"
              }
              value={dialog.request ? comments[dialog.request._id] ?? "" : ""}
              onChange={(e) =>
                dialog.request && setComments((c) => ({ ...c, [dialog.request!._id]: e.target.value }))
              }
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" className="rounded-none border-border" onClick={() => setDialog({ request: null, action: null })}>
              Cancel
            </Button>
            <Button
              type="button"
              className={`rounded-none ${
                dialog.action === "reject" ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
              }`}
              disabled={isReviewing}
              onClick={submitReview}
            >
              Confirm {dialog.action === "approve" ? "approval" : "rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
