import { useCredentialHistory } from "@/hooks/queries/company"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Link } from "react-router"

export default function CredentialHistoryPage() {
    const { data, isPending, error } = useCredentialHistory()

    if (isPending) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Spinner className="size-8 text-primary" />
            </div>
        )
    }

    if (error) {
        return <div className="p-6 text-sm text-destructive">Failed to load credential history.</div>
    }

    return (
        <div className="w-full">
            <header className="sticky top-0 z-10 border-b border-border bg-background">
                <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
                    <Link
                        to="/admin"
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-foreground hover:bg-muted"
                    >
                        <ArrowLeft className="size-4" />
                    </Link>
                    <div>
                        <h1 className="text-lg font-semibold tracking-tight">Credential history</h1>
                        <p className="text-xs text-muted-foreground">Users promoted from normal to lead</p>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
                {!data || data.length === 0 ? (
                    <div className="rounded-none border border-dashed border-border/60 bg-card py-14 text-center text-sm text-muted-foreground">
                        No promotions recorded yet.
                    </div>
                ) : (
                    <div className="overflow-hidden border border-border bg-card">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[700px] text-left text-sm">
                                <thead>
                                    <tr className="border-b border-border bg-muted/30 text-xs uppercase text-muted-foreground">
                                        <th className="px-4 py-3 font-medium sm:px-5">User</th>
                                        <th className="px-4 py-3 font-medium sm:px-5">Credentials</th>
                                        <th className="px-4 py-3 font-medium sm:px-5">Company</th>
                                        <th className="px-4 py-3 font-medium sm:px-5">Promoted by</th>
                                        <th className="px-4 py-3 font-medium sm:px-5">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item) => (
                                        <tr key={item._id} className="border-b border-border last:border-0">
                                            <td className="px-4 py-4 sm:px-5">
                                                <p className="font-medium text-foreground">{item.userId?.name ?? "—"}</p>
                                                <Badge variant="outline" className="mt-1 rounded-none text-[10px] text-primary border-primary/30">
                                                    {item.userId?.role ?? "LEAD"}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-4 sm:px-5">
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span className="text-muted-foreground line-through">{item.previousEmail}</span>
                                                    <ArrowRight className="size-3 shrink-0 text-muted-foreground" />
                                                    <span className="font-medium text-foreground">{item.newEmail}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 sm:px-5">
                                                <p className="font-medium">{item.companyName}</p>
                                                <p className="text-xs text-muted-foreground">{item.position}</p>
                                            </td>
                                            <td className="px-4 py-4 sm:px-5 text-muted-foreground text-xs">
                                                {item.promotedBy?.name ?? "—"}
                                            </td>
                                            <td className="px-4 py-4 sm:px-5 text-muted-foreground text-xs whitespace-nowrap">
                                                {new Date(item.promotedAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
