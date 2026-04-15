import { useState } from "react"
import { useNavigate } from "react-router"
import { changePassword } from "@/api/auth"
import { useQueryClient } from "@tanstack/react-query"
import { SESSION_KEY } from "@/hooks/queries/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { KeyRound } from "lucide-react"

export default function ChangePasswordPage() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [newPassword, setNewPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const [isPending, setIsPending] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters.")
            return
        }
        if (newPassword !== confirm) {
            toast.error("Passwords do not match.")
            return
        }
        setIsPending(true)
        try {
            await changePassword(newPassword)
            // refresh session so mustChangePassword is cleared
            await queryClient.invalidateQueries({ queryKey: SESSION_KEY })
            toast.success("Password updated. Welcome to Vettd!")
            navigate("/community")
        } catch (e: any) {
            toast.error(e.message || "Failed to change password.")
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="min-h-150 flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-sm space-y-6">
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                        <KeyRound className="size-6 text-amber-600" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">Set your new password</h1>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Your account was provisioned with a temporary password. Please set a new one before continuing.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">New password</label>
                        <Input
                            type="password"
                            placeholder="At least 6 characters"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="rounded-none"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Confirm password</label>
                        <Input
                            type="password"
                            placeholder="Repeat your new password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            className="rounded-none"
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full rounded-none" disabled={isPending}>
                        {isPending ? "Saving…" : "Set password & continue"}
                    </Button>
                </form>
            </div>
        </div>
    )
}
