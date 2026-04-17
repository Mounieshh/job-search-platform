import { useCredentialHistory } from "@/hooks/queries/company"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
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

type SortKey = "userName" | "companyName" | "promotedBy" | "promotedAt"
type SortDir = "asc" | "desc"

const PAGE_SIZE_OPTIONS = [10, 20, 50]

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
    if (col !== sortKey) return <ArrowUpDown className="ml-1.5 inline size-3.5 text-muted-foreground/50" aria-hidden="true" />
    return sortDir === "asc"
        ? <ArrowUp className="ml-1.5 inline size-3.5 text-primary" aria-hidden="true" />
        : <ArrowDown className="ml-1.5 inline size-3.5 text-primary" aria-hidden="true" />
}

export default function CredentialHistoryPage() {
    const { data, isPending, error } = useCredentialHistory()

    const [searchText, setSearchText] = useState("")
    const [sortKey, setSortKey] = useState<SortKey>("promotedAt")
    const [sortDir, setSortDir] = useState<SortDir>("desc")
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const toggleSort = (col: SortKey) => {
        if (sortKey === col) setSortDir(d => d === "asc" ? "desc" : "asc")
        else { setSortKey(col); setSortDir("asc") }
        setPage(1)
    }

    const enriched = useMemo(() => {
        return (data ?? []).map(item => ({
            ...item,
            userName: item.userId?.name ?? "—",
            promotedBy: item.promotedBy?.name ?? "—",
        }))
    }, [data])

    const filtered = useMemo(() => {
        const q = searchText.trim().toLowerCase()
        return enriched.filter(item =>
            !q || [item.userName, item.companyName, item.newEmail, item.previousEmail].join(" ").toLowerCase().includes(q)
        )
    }, [enriched, searchText])

    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
            if (sortKey === "promotedAt") {
                const av = new Date(a.promotedAt).getTime()
                const bv = new Date(b.promotedAt).getTime()
                return sortDir === "asc" ? av - bv : bv - av
            }
            const av = (a[sortKey] ?? "") as string
            const bv = (b[sortKey] ?? "") as string
            return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av)
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
        <div className="flex min-h-[50vh] items-center justify-center">
            <Spinner className="size-6 text-muted-foreground" />
        </div>
    )

    if (error) return (
        <div className="p-6 text-sm text-destructive">Failed to load credential history.</div>
    )

    const cols: { key: SortKey; label: string }[] = [
        { key: "userName", label: "User" },
        { key: "companyName", label: "Company" },
        { key: "promotedBy", label: "Promoted by" },
        { key: "promotedAt", label: "Date" },
    ]

    return (
        <div className="w-full space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-lg font-semibold tracking-tight">Credential history</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {filtered.length} of {enriched.length} promotion{enriched.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <div className="relative w-full max-w-xs">
                    <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <Input
                        value={searchText}
                        onChange={e => handleSearch(e.target.value)}
                        placeholder="Search history…"
                        aria-label="Search credential history"
                        className="pl-9 h-9"
                    />
                </div>
            </div>

            {/* Table */}
            {sorted.length === 0 ? (
                <div className="rounded-md border border-dashed border-border/60 bg-card py-14 text-center text-sm text-muted-foreground">
                    {searchText ? `No history matches "${searchText}"` : "No promotions recorded yet."}
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
                                    <TableHead scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Credentials
                                    </TableHead>
                                    <TableHead scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Position
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginated.map(item => (
                                    <TableRow key={item._id}>
                                        <TableCell className="px-4 py-3">
                                            <p className="font-medium text-foreground">{item.userName}</p>
                                            <Badge variant="outline" className="mt-1 text-[10px] text-primary border-primary/30">
                                                {item.userId?.role ?? "LEAD"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 font-medium text-foreground">{item.companyName}</TableCell>
                                        <TableCell className="px-4 py-3 text-muted-foreground text-xs">{item.promotedBy}</TableCell>
                                        <TableCell className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                                            {new Date(item.promotedAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className="text-muted-foreground line-through">{item.previousEmail}</span>
                                                <ArrowRight aria-hidden="true" className="size-3 shrink-0 text-muted-foreground" />
                                                <span className="font-medium text-foreground">{item.newEmail}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-muted-foreground text-sm">{item.position}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Footer */}
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
