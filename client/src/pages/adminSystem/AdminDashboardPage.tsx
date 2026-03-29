import { useAdminCompanyDirectory, useAdminLeadRequests } from "@/hooks/queries/admin";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router";
import {
  Building2,
  ChevronDown,
  ChevronRight,
  Users,
  Briefcase,
  Inbox,
} from "lucide-react";
import { useState } from "react";

export default function AdminDashboardPage() {
  const { data: companies, isLoading: loadingCompanies } = useAdminCompanyDirectory();
  const { data: leadRequests, isLoading: loadingLeads } = useAdminLeadRequests();
  const [openId, setOpenId] = useState<string | null>(null);

  const pendingLeadCount = leadRequests?.length ?? 0;

  if (loadingCompanies || loadingLeads) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  const usersCount = companies?.reduce((n, c) => n + c.users.length, 0) ?? 0;

  return (
    <div className="w-full">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">Companies, members, and moderation queues.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/admin/lead-requests"
              className="inline-flex items-center gap-2 rounded border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              <Inbox className="size-4" />
              Lead requests
              {pendingLeadCount > 0 ? (
                <Badge variant="outline" className="rounded-none">
                  {pendingLeadCount}
                </Badge>
              ) : null}
            </Link>
            <Link
              to="/admin/requests"
              className="inline-flex items-center gap-2 rounded border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Job queue
            </Link>
            <Link
              to="/admin/reviewed"
              className="inline-flex items-center gap-2 rounded border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Reviewed jobs
            </Link>
          </div>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-none border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="size-4" />
              <span className="text-xs font-medium uppercase">Companies</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{companies?.length ?? 0}</p>
          </div>
          <div className="rounded-none border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="size-4" />
              <span className="text-xs font-medium uppercase">Members</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{usersCount}</p>
          </div>
          <div className="rounded-none border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="size-4" />
              <span className="text-xs font-medium uppercase">Pending lead apps</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{pendingLeadCount}</p>
          </div>
        </div>

        <div className="overflow-hidden border border-border bg-card">
          <div className="border-b border-border px-4 py-3 sm:px-5">
            <h2 className="text-sm font-semibold">Companies & users</h2>
            <p className="text-xs text-muted-foreground">Click to expand users per company.</p>
          </div>

          {!companies?.length ? (
            <div className="py-10 text-center text-sm text-muted-foreground">No companies yet.</div>
          ) : (
            <ul className="divide-y divide-border">
              {companies.map((co) => {
                const expanded = openId === co.id;
                return (
                  <li key={co.id}>
                    <button
                      type="button"
                      onClick={() => setOpenId(expanded ? null : co.id)}
                      className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition hover:bg-muted sm:px-5"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        {expanded ? (
                          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-medium">{co.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {co.users.length} user{co.users.length !== 1 ? "s" : ""} · {co.totalJobs} job
                            {co.totalJobs !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Link
                          to={`/${co.id}/users`}
                          className="text-xs font-medium text-primary hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Open
                        </Link>
                      </div>
                    </button>

                    {expanded ? (
                      <div className="border-t border-border px-4 pb-4 pt-2 sm:px-5">
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[640px] text-left text-sm">
                            <thead>
                              <tr className="text-xs uppercase text-muted-foreground">
                                <th className="py-2 pr-4 font-medium">Name</th>
                                <th className="py-2 pr-4 font-medium">Email</th>
                                <th className="py-2 pr-4 font-medium">Role</th>
                                <th className="py-2 pr-4 font-medium">Verified</th>
                                <th className="py-2 font-medium">Title</th>
                              </tr>
                            </thead>
                            <tbody>
                              {co.users.length === 0 ? (
                                <tr>
                                  <td colSpan={5} className="py-6 text-center text-muted-foreground">
                                    No users linked to this company.
                                  </td>
                                </tr>
                              ) : (
                                co.users.map((u) => (
                                  <tr key={u._id} className="border-t border-border">
                                    <td className="py-3 pr-4 font-medium">{u.name}</td>
                                    <td className="py-3 pr-4">{u.email}</td>
                                    <td className="py-3 pr-4">
                                      <Badge variant="outline" className="rounded-none">
                                        <span
                                          className={
                                            u.role === "LEAD"
                                              ? "text-primary"
                                              : u.role === "ADMIN"
                                                ? "text-destructive"
                                                : ""
                                          }
                                        >
                                          {u.role}
                                        </span>
                                      </Badge>
                                    </td>
                                    <td className="py-3 pr-4">{u.isEmailVerified ? "Yes" : "No"}</td>
                                    <td className="py-3 text-muted-foreground">{u.company?.position ?? "—"}</td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
