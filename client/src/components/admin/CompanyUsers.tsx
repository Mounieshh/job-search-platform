import { useCompanyUsers } from "@/hooks/queries/company"
import { Link, useParams } from "react-router"
import { Spinner } from "../ui/spinner"
import { ArrowLeft } from "lucide-react"
import { Badge } from "../ui/badge"

const CompanyUsers = () => {
    const { companyId } = useParams()
    const { data = [], isPending, error } = useCompanyUsers(companyId)

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
                <p className="text-sm text-destructive">Unable to load company users.</p>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto p-5 space-y-5">

            <Link
                to="/company"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
            >
                <ArrowLeft className="size-4" />
                <span>Back to Company List</span>
            </Link>

            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold uppercase font-mono tracking-wide">
                    Company Users
                </h1>
                <Badge variant="ghost" className="font-mono">
                    {data.length} {data.length === 1 ? "user" : "users"}
                </Badge>
            </div>

            {data.length === 0 ? (
                <div className="border border-border p-6 text-center text-sm text-muted-foreground">
                    No users found for this company.
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {data.map((user, index) => (
                        <div
                            key={user._id}
                            className="border border-border bg-card p-4 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-mono text-muted-foreground">
                                    {String(index + 1).padStart(2, "0")}
                                </span>

                                <div className="flex flex-col gap-0.5">
                                    <span className="text-sm font-medium">{user.name}</span>
                                    <span className="text-xs text-muted-foreground">{user.email}</span>
                                    <span className="text-xs uppercase tracking-wide text-muted-foreground">
                                        {user.company?.position ?? "N/A"}
                                    </span>
                                </div>
                            </div>

                            <Badge variant="ghost" className="text-xs font-mono uppercase">
                                {user.role}
                            </Badge>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default CompanyUsers