import { useCompanyUsers } from "@/hooks/queries/company"
import { Link, useParams } from "react-router"
import { Spinner } from "@/components/ui/spinner"
import { ArrowLeft, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useMemo, useState } from "react"
import { Input } from "../ui/input"

const CompanyUsers = () => {
    const { companyId, userId } = useParams()
    const { data = [], isPending, error } = useCompanyUsers(companyId)

    const [searchText, setSearchText] = useState("")

    const selectedUser = useMemo(() => data.find((u) => u._id === userId), [data, userId])

    const filteredUsers = useMemo(() => {
        const normalizedQuery = searchText.trim().toLowerCase()

        return data.filter((user) => {
            const combined = [user.name, user.email]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
            return !normalizedQuery || combined.includes(normalizedQuery)
        })
    }, [data, searchText])

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
        <main className="w-full grid grid-cols-1 md:grid-cols-3 gap-3">
            <section className="md:col-span-1 bg-card border border-border min-h-max">
                <div className="p-3 border-b border-border flex items-center justify-between gap-2">
                    <h2 className="font-semibold">Users</h2>
                    <Link to="/company" className="text-xs inline-flex items-center gap-1 hover:underline">
                        <ArrowLeft className="size-3" />
                        Back
                    </Link>
                </div>

                <div className="p-3 border-b border-border">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                        <Input
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="Search users..."
                            className="pl-10 h-9 rounded-none focus-visible:ring-1 text-sm"
                        />
                    </div>
                </div>

                {filteredUsers.length === 0 ? (
                    <div className="p-4 text-sm text-muted-foreground">
                        No users signed in yet
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {filteredUsers.map((user) => {
                            const isActive = user._id === userId

                            return (
                                <Link
                                    key={user._id}
                                    to={`/${companyId}/users/${user._id}`}
                                    className={`block p-3 text-sm border-b border-border/50 last:border-b-0 transition-colors hover:bg-primary/10 ${isActive ? "bg-muted/70" : ""}`}
                                >
                                    <p className="font-medium text-foreground">{user.name}</p>
                                    <p className="text-xs text-muted-foreground">{user.role}</p>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </section>

            <section className="md:col-span-2 bg-card border border-border p-4 sm:p-5">
                {!userId && (
                    <p className="text-sm text-muted-foreground">
                        Select a user from the left to view details.
                    </p>
                )}

                {userId && !selectedUser && (
                    <p className="text-sm text-destructive">User not found.</p>
                )}

                {selectedUser && (
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                        <Badge variant="secondary">{selectedUser.role}</Badge>

                        <div className="pt-3 mt-3 border-t border-border/50 space-y-2 text-sm">
                            <div><span className="font-medium">Email Verified:</span> <span className={selectedUser.isEmailVerified ? "text-green-600 font-medium" : "text-red-500 font-medium"}>{selectedUser.isEmailVerified ? "Verified" : "Not Verified"}</span></div>
                            <div><span className="font-medium">User ID:</span> <span className="text-muted-foreground">{selectedUser._id}</span></div>
                            <div><span className="font-medium">Company:</span> <span className="text-muted-foreground">{selectedUser.company?.companyName ?? "-"}</span></div>
                            <div><span className="font-medium">Position:</span> <span className="text-muted-foreground">{selectedUser.company?.position ?? "-"}</span></div>
                        </div>
                    </div>
                )}
            </section>
        </main>
    )
}

export default CompanyUsers