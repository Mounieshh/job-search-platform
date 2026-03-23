import { useProfile } from "@/hooks/queries/profile"

const UserProfile = () => {
    const { data: user, isPending, error } = useProfile()

    const prettyAccountType = user?.accountType
        ? user.accountType
            .replaceAll("_", " ")
            .split(" ")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ")
        : "-"

    const profileFields = [
        { label: "Name", value: user?.name || "-" },
        { label: "Registered Email", value: user?.email || "-" },
        { label: "Role", value: user?.role || "-" },
        { label: "Account Type", value: prettyAccountType || "-" },
    ]

    if (isPending) {
        return (
            <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6">
                <div className="space-y-4">
                    <div className="h-24 animate-pulse rounded-xl border border-border bg-muted/40" />
                    <div className="h-56 animate-pulse rounded-xl border border-border bg-muted/40" />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6">
                <div className="rounded-xl border border-border bg-card px-4 py-6 text-sm text-muted-foreground">
                    Unable to load profile details right now.
                </div>
            </div>
        )
    }

    const initial = user?.name?.charAt(0)?.toUpperCase() || "U"

  return (
        <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6">
            <h1 className="mb-6 border-b pb-5 text-lg font-semibold tracking-tight text-foreground">My Profile</h1>
            <div className="w-full flex flex-col gap-6 lg:flex-row">
                <section className="w-full lg:w-1/3 min-w-0">

                    <div className="flex flex-row gap-4 items-center">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xl font-semibold text-foreground">
                            {initial}
                        </div>

                        <div className="min-w-0 space-y-1">
                            <p className="truncate text-base font-semibold text-foreground">{user?.name || "User"}</p>
                            <p className="text-sm text-muted-foreground">{user?.role || "-"}</p>
                        </div>
                    </div>
                </section>

                <section className="w-full lg:w-2/3 min-w-0 rounded-xl">
                    <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
                        <h2 className="text-base font-semibold text-foreground">Personal Information</h2>
                        <span className="rounded-md border border-[#D4903A] px-2.5 py-1 text-xs text-muted-foreground">
                            Read only
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 px-4 py-5 sm:grid-cols-2 sm:px-6">
                        {profileFields.map((field) => (
                            <div key={field.label} className="space-y-1">
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    {field.label}
                                </p>
                                <p className="wrap-break-word text-sm font-medium text-foreground">
                                    {field.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
  )
}

export default UserProfile