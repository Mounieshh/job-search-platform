import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useCompanyList } from "@/hooks/queries/company"
import { Search } from "lucide-react"
import { useMemo, useState } from "react"
import { Link } from "react-router"

export default function CompanyList() {

    const { data = [] as const, isPending, error } = useCompanyList()
    const companies = Array.isArray(data) ? data : []
    const [searchText, setSearchText] = useState("")

    const filteredCompanies = useMemo(() => {
            const normalizedQuery = searchText.trim().toLowerCase()
    
            return companies.filter((job) => {
                const combined = [job.companyUsers, job.name]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase()
                return !normalizedQuery || combined.includes(normalizedQuery)
            })
        }, [companies, searchText])

    if (isPending) {
        return (
            <div className="min-h-50 flex justify-center pt-10">
                <Spinner className="size-7" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-50 flex justify-center pt-10">
                <p className="text-sm text-destructive">Error fetching companies.</p>
            </div>
        )
    }

    return (
        <div>
            {data.length === 0 ? (
                <div className="min-h-50 flex justify-center pt-10 text-sm text-muted-foreground">
                    No Companies Found
                </div>
            ) : (

                <>
                <div className="relative w-full max-w-sm p-3 sm:px-5 sm:pt-5 sm:pb-2">
                    <Search className="absolute left-7 top-8 md:top-10 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <Input
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search companies..."
                        className="h-10 w-full pl-10 rounded-none focus-visible:ring-1"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 p-3 sm:grid-cols-2 lg:grid-cols-3 sm:p-5">
                    {filteredCompanies.map((com) => (
                        <div
                            key={com.id}
                            className="border border-border bg-card p-5 sm:p-6 flex flex-col gap-3"
                        >
                            <div className="flex items-center gap-2">
                                
                                <span className="font-serif font-semibold uppercase tracking-wide text-foreground">
                                    {com.name}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="text-xs font-medium font-serif flex items-center gap-1">
                                    <span className="uppercase">Users :</span>
                                    <Badge variant="ghost">{com.companyUsers}</Badge>
                                </div>

                                <Link
                                    to={`/${com.id}/users`}
                                    className="text-xs border px-3 py-1 hover:bg-muted transition-colors border-primary"
                                >
                                    View Users
                                </Link>
                            </div>


                        </div>
                    ))}
                </div>
                </>
            )}
        </div>
    )
}