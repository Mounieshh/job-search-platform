import { useCompanyUsers } from "@/hooks/queries/company"
import { useParams } from "react-router"
import { Spinner } from "@/components/ui/spinner"
import { Search, ArrowUpDown, ArrowUp, ArrowDown, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from "@/components/ui/table"
import {
    Pagination, PaginationContent, PaginationItem,
    PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
    Drawer, DrawerClose, DrawerContent,
    DrawerHeader, DrawerTitle, DrawerDescription,
} from "@/components/ui/drawer"

type SortKey = "name" | "email" | "role"
type SortDir = "asc" | "desc"

const PAGE_SIZE_OPTIONS = [10, 20, 50]

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
    if (col !== sortKey) return <ArrowUpDown className="ml-1.5 inline size-3.5 text-muted-foreground/50" aria-hidden="true" />
    return sortDir === "asc"
        ? <ArrowUp className="ml-1.5 inline size-3.5 text-primary" aria-hidden="true" />
        : <ArrowDown className="ml-1.5 inline size-3.5 text-primary" aria-hidden="true" />
}

const CompanyUsers = () => {
    const { companyId } = useParams()
    const { data = [], isPending, error } = useCompanyUsers(companyId)

    const [searchText, setSearchText] = useState("")
    const [sortKey, setSortKey] = useState<SortKey>("name")
    const [sortDir, setSortDir] = useState<SortDir>("asc")
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [selectedUser, setSelectedUser] = useState<CompanyUsersList | null>(null)

    const toggleSort = (col: SortKey) => {
        if (sortKey === col) setSortDir(d => d === "asc" ? "desc" : "asc")
        else { setSortKey(col); setSortDir("asc") }
        setPage(1)
    }

    const filtered = useMemo(() => {
        const q = searchText.trim().toLowerCase()
        return data.filter(u =>
            !q || [u.name, u.email].join(" ").toLowerCase().includes(q)
        )
    }, [data, searchText])

    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
            const av = (a[sortKey] ?? "") as string
            const bv = (b[sortKey] ?? "") as string
            return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av)
        })
    }, [filtered, sortKey, sortDir])

    const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
    const paginated = sorted.slice((page - 1) * pageSize, page * pageSize)

    const handleSearch = (v: string) => { setSearchText(v); setPage(1) }
    const handlePageSize = (v: string) => { setPageSize(Number(v)); setPage(1) }

    if (isPending) return (
        <div className="flex justify-center pt-10">
            <Spinner className="size-6 text-muted-foreground" />
        </div>
    )

    if (error) return (
        <div className="flex justify-center pt-10">
            <p className="text-sm text-destructive">Unable to load company users.</p>
        </div>
    )

    const cols: { key: SortKey; label: string }[] = [
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "role", label: "Role" },
    ]

    return (
        <div className="w-full space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-lg font-semibold tracking-tight">Company users</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {filtered.length} of {data.length} member{data.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <div className="relative w-full max-w-xs">
                    <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <Input
                        value={searchText}
                        onChange={e => handleSearch(e.target.value)}
                        placeholder="Search users…"
                        aria-label="Search users"
                        className="pl-9 h-9"
                    />
                </div>
            </div>

            {/* Table */}
            {sorted.length === 0 ? (
                <div className="rounded-md border border-dashed border-border/60 bg-card py-14 text-center text-sm text-muted-foreground">
                    {searchText ? `No users match "${searchText}"` : "No users yet."}
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
                                        Verified
                                    </TableHead>
                                    <TableHead scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Position
                                    </TableHead>
                                    <TableHead scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">
                                        Details
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginated.map(user => (
                                    <TableRow key={user._id}>
                                        <TableCell className="px-4 py-3 font-medium text-foreground">{user.name}</TableCell>
                                        <TableCell className="px-4 py-3 text-muted-foreground">{user.email}</TableCell>
                                        <TableCell className="px-4 py-3">
                                            <Badge variant="secondary" className="text-xs">{user.role}</Badge>
                                        </TableCell>
                                        <TableCell className="px-4 py-3">
                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                                user.isEmailVerified
                                                    ? "bg-primary/10 text-primary"
                                                    : "bg-destructive/10 text-destructive"
                                            }`}>
                                                {user.isEmailVerified ? "Verified" : "Unverified"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-muted-foreground text-sm">
                                            {user.company?.position ?? "—"}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                aria-label={`View details for ${user.name}`}
                                                onClick={() => setSelectedUser(user)}
                                                className="text-xs font-medium text-primary hover:text-primary h-7 px-2"
                                            >
                                                View
                                            </Button>
                                        </TableCell>
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
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                                        <PaginationItem key={n}>
                                            <PaginationLink
                                                isActive={n === page}
                                                onClick={() => setPage(n)}
                                                className="cursor-pointer"
                                            >
                                                {n}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
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

            {/* User detail drawer */}
            <Drawer
                direction="right"
                open={!!selectedUser}
                onOpenChange={open => { if (!open) setSelectedUser(null) }}
            >
                <DrawerContent className="sm:max-w-sm overflow-y-auto">
                    <DrawerHeader className="border-b border-border pb-4">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <DrawerTitle className="text-base truncate">
                                    {selectedUser?.name}
                                </DrawerTitle>
                                <DrawerDescription className="truncate mt-0.5">
                                    {selectedUser?.email}
                                </DrawerDescription>
                            </div>
                            <DrawerClose asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
                                    aria-label="Close user details"
                                >
                                    <X aria-hidden="true" className="size-4" />
                                </Button>
                            </DrawerClose>
                        </div>
                    </DrawerHeader>

                    {selectedUser && (
                        <div className="p-4 space-y-5">
                            {/* Badges */}
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">{selectedUser.role}</Badge>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    selectedUser.isEmailVerified
                                        ? "bg-primary/10 text-primary"
                                        : "bg-destructive/10 text-destructive"
                                }`}>
                                    {selectedUser.isEmailVerified ? "Email verified" : "Email not verified"}
                                </span>
                            </div>

                            {/* Details */}
                            <div className="space-y-3 text-sm">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">User ID</span>
                                    <span className="font-mono text-xs text-foreground break-all">{selectedUser._id}</span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Company</span>
                                    <span className="text-foreground">{selectedUser.company?.companyName ?? "—"}</span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Position</span>
                                    <span className="text-foreground">{selectedUser.company?.position ?? "—"}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default CompanyUsers
