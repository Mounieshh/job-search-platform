import { Spinner } from "@/components/ui/spinner"
import { useEffect, useState } from "react"

export type Company = {
    id: string
    name: string
    domain: string
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

                const response = await fetch("http://localhost:5000/api/company/list", {
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {company.map((com, index) => (
                        <div
                            key={com.id}
                            className="border border-border bg-card p-6 flex flex-col gap-3"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-muted-foreground">
                                    {String(index + 1).padStart(2, "0")}
                                </span>

                                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                                    {com.name}
                                </span>
                            </div>

                            <div className="text-sm font-medium">
                                Company Users Count: {com.companyUsers}
                            </div>

                            <div>
                                Jobs Posted: {com.postCount}
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}