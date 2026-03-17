import { useProfile } from "@/hooks/queries/profile"

const UserProfile = () => {
    const { data: user } = useProfile()

    const profileFields = [
        { label: "Name", value: user?.name },
        { label: "Registered Email", value: user?.email },
        { label: "Role Logged in", value: user?.role },
        { label: "Account Type", value: user?.accountType },
    ]

  return (
        <div className="mx-auto w-full max-w-3xl">
            <div className="overflow-hidden border-2 border-border bg-card shadow-sm">
                <div className="border-b border-border bg-muted/40 px-4 py-3 sm:px-5">
                    <h1 className="text-lg font-semibold tracking-tight">My Profile</h1>
                    <p className="text-sm text-muted-foreground">Your account details</p>
                </div>

                <div className="p-3 sm:p-5">
                    <div className="space-y-2.5">
                        {profileFields.map((field) => (
                            <div
                                key={field.label}
                                className="grid gap-2 border border-border bg-card p-3 sm:grid-cols-[12rem_1fr] sm:items-center"
                            >
                                <h2 className="text-sm font-semibold text-foreground">{field.label}</h2>
                                <p className="wrap-break-word text-sm text-muted-foreground">{field.value || "-"}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
    </div>
  )
}

export default UserProfile