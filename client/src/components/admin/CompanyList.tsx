import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useCompanyList } from "@/hooks/queries/company"
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { useMemo, useState } from "react"
import { Link } from "react-router"
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from "@/components/ui/table"
import {
    Pagination, PaginationContent, PaginationItem,
    PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis,
} from "@/components/ui/pagination"
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select"

type SortKey = "name" | "totalJobs" | "leadUsers" | "normalUsers" | "companyUsers"
type SortDir = "asc" | "desc"

const PAGE_SIZE_OPTIONS = [10, 20, 50]

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
    if (col !== sortKey) return <ArrowUpDown className="ml-1.5 inline size-3.5 text-muted-foreground/50" aria-hidden="true" />
    return sortDir === "asc"
        ? <ArrowUp className="ml-1.5 inline size-3.5 text-primary" aria-hidden="true" />
        : <ArrowDown className="ml-1.5 inline size-3.5 text-primary" aria-hidden="true" />
}

export default function CompanyList() {
    const { data = [] as const, isPending, error } = useCompanyList()
    const companies = Array.isArray(data) ? data : []

    const [searchText, setSearchText] = useState("")
    const [sortKey, setSortKey] = useState<SortKey>("name")
    const [sortDir, setSortDir] = useState<SortDir>("asc")
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const toggleSort = (col: SortKey) => {
        if (sortKey === col) {
            setSortDir(d => d === "asc" ? "desc" : "asc")
        } else {
            setSortKey(col)
            setSortDir("asc")
        }
        setPage(1)
    }

    const filtered = useMemo(() => {
        const q = searchText.trim().toLowerCase()
        return companies.filter(co =>
            !q || co.name.toLowerCase().includes(q)
        )
    }, [companies, searchText])

    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
            const av = a[sortKey]
            const bv = b[sortKey]
            if (typeof av === "string" && typeof bv === "string") {
                return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av)
            }
            return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number)
        })
    }, [filtered, sortKey, sortDir])

    const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
    const paginated = sorted.slice((page - 1) * pageSize, page * pageSize)

    const handleSearch = (v: string) => { setSearchText(v); setPage(1) }
    const handlePageSize = (v: string) => { setPageSize(Number(v)); setPage(1) }

    const pageNumbers = useMemo(() => {
        const pages: (number | "ellipsis")[] = []
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
            pages.push(1)
            if (page > 3) pages.push("ellipsis")
            for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
            if (page < totalPages - 2) pages.push("ellipsis")
            pages.push(totalPages)
        }
        return pages
    }, [page, totalPages])

    if (isPending) return (
        <div className="flex justify-center pt-10">
            <Spinner className="size-6 text-muted-foreground" />
        </div>
    )

    if (error) return (
        <div className="flex justify-center pt-10">
            <p className="text-sm text-destructive">Error fetching companies.</p>
        </div>
    )

    const cols: { key: SortKey; label: string }[] = [
        { key: "name", label: "Company" },
        { key: "totalJobs", label: "Jobs" },
        { key: "leadUsers", label: "Leads" },
        { key: "normalUsers", label: "Users" },
        { key: "companyUsers", label: "Total members" },
    ]

    return (
        <div className="w-full space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-lg font-semibold tracking-tight">Companies</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {filtered.length} of {companies.length} registered
                    </p>
                </div>
                <div className="relative w-full max-w-xs">
                    <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <Input
                        value={searchText}
                        onChange={e => handleSearch(e.target.value)}
                        placeholder="Search companies…"
                        aria-label="Search companies"
                        className="pl-9 h-9"
                    />
                </div>
            </div>

            {/* Table */}
            {sorted.length === 0 ? (
                <div className="rounded-md border border-dashed border-border/60 bg-card py-14 text-center text-sm text-muted-foreground">
                    {searchText ? `No companies match "${searchText}"` : "No companies yet."}
                </div>
            ) : (
                <>
                    <div className="overflow-hidden rounded-md border border-border bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30 hover:bg-muted/30">
                                    {cols.map(({ key, label }) => (
                                        <TableHead key={key} scope="col" className="px-4 py-3">
                                            <button
                                                type="button"
                                                onClick={() => toggleSort(key)}
                                                className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                                                aria-label={`Sort by ${label}`}
                                            >
                                                {label}
                                                <SortIcon col={key} sortKey={sortKey} sortDir={sortDir} />
                                            </button>
                                        </TableHead>
                                    ))}
                                    <TableHead scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginated.map(co => (
                                    <TableRow key={co.id}>
                                        <TableCell className="px-4 py-3 font-medium text-foreground">{co.name}</TableCell>
                                        <TableCell className="px-4 py-3 text-muted-foreground">{co.totalJobs}</TableCell>
                                        <TableCell className="px-4 py-3 text-muted-foreground">{co.leadUsers ?? "—"}</TableCell>
                                        <TableCell className="px-4 py-3 text-muted-foreground">{co.normalUsers ?? "—"}</TableCell>
                                        <TableCell className="px-4 py-3 text-muted-foreground">{co.companyUsers}</TableCell>
                                        <TableCell className="px-4 py-3 text-right">
                                            <Link
                                                to={`/${co.id}/users`}
                                                aria-label={`View users for ${co.name}`}
                                                className="text-xs font-medium text-primary hover:underline underline-offset-4"
                                            >
                                                View users
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Footer: page size + pagination */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Rows per page</span>
                            <Select value={String(pageSize)} onValueChange={handlePageSize}>
                                <SelectTrigger size="sm" className="w-16 h-8 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {PAGE_SIZE_OPTIONS.map(n => (
                                        <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <span>
                                {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} of {sorted.length}
                            </span>
                        </div>

                        {totalPages > 1 && (
                            <Pagination className="mx-0 w-auto justify-end">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            aria-disabled={page === 1}
                                            className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>
                                    {pageNumbers.map((n, i) =>
                                        n === "ellipsis" ? (
                                            <PaginationItem key={`e-${i}`}>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        ) : (
                                            <PaginationItem key={n}>
                                                <PaginationLink
                                                    isActive={n === page}
                                                    onClick={() => setPage(n)}
                                                    className="cursor-pointer"
                                                >
                                                    {n}
                                                </PaginationLink>
                                            </PaginationItem>
                                        )
                                    )}
                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            aria-disabled={page === totalPages}
                                            className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
