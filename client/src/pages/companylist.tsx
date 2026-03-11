import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { baseUrl } from "@/lib/base"
import { useEffect, useState } from "react"

export type Company = {
    id: string
    name: string
    companyUsers: number
    postCount: number
}

export default function CompanyList() {

    const [company, setCompany] = useState<Company[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const companyList = async () => {
            try {
                setLoading(true)

                const response = await fetch(`${baseUrl}/api/company/list`, {
                    method: "GET",
                    credentials: "include"
                })

                if (!response.ok) {
                    throw new Error("Failed to fetch companies")
                }

                const data = await response.json()

                setCompany(data.result)

            } catch (error: any) {
                console.log(error.message)
            } finally {
                setLoading(false)
            }
        }

        companyList()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center pt-10">
                <Spinner className="size-7" />
            </div>
        )
    }

    return (
        <div>
            {company.length === 0 ? (
                <div>No Companies Found</div>
            ) : (
                <div className="grid grid-cols-1 gap-4 p-3 sm:grid-cols-2 lg:grid-cols-3 sm:p-5">
                    {company.map((com, index) => (
                        <div
                            key={com.id}
                            className="border border-border bg-card p-5 sm:p-6 flex flex-col gap-3"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-muted-foreground">
                                    {String(index + 1).padStart(2, "0")}
                                </span>

                                <span className="text-xs font-mono uppercase tracking-widest text-black font-semibold">
                                    {com.name}
                                </span>
                            </div>

                            <div className="text-xs font-medium">
                                <span className="uppercase">
                                    Users :
                                </span>
                                <Badge variant="ghost">
                                    {com.companyUsers}
                                </Badge>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}