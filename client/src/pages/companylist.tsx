import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { useCompanyList } from "@/hooks/queries/company"
import { Link } from "react-router"

export default function CompanyList() {

    const { data = [], isPending, error } = useCompanyList()

    if (isPending) {
        return (
            <div className="min-h-screen flex justify-center pt-10">
                <Spinner className="size-7" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center pt-10">
                <p className="text-sm text-destructive">Error fetching companies.</p>
            </div>
        )
    }

    return (
        <div>
            {data.length === 0 ? (
                <div className="min-h-screen flex justify-center pt-10 text-sm text-muted-foreground">
                    No Companies Found
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 p-3 sm:grid-cols-2 lg:grid-cols-3 sm:p-5">
                    {data.map((com, index) => (
                        <div
                            key={com.id}
                            className="border border-border bg-card p-5 sm:p-6 flex flex-col gap-3"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-muted-foreground">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <span className="font-bold uppercase tracking-wide text-foreground">
                                    {com.name}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="text-xs font-medium flex items-center gap-1">
                                    <span className="uppercase">Users :</span>
                                    <Badge variant="ghost">{com.companyUsers}</Badge>
                                </div>

                                <Link
                                    to={`/${com.id}/users`}
                                    className="text-xs border border-border px-3 py-1 hover:bg-muted transition-colors"
                                >
                                    View Users
                                </Link>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}