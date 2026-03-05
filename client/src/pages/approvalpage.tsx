import { useAuth } from "@/context/AuthContext"

export default function ApprovalPage() {
    const { user } = useAuth()

  return (
    <div>
        {user && user.role === "ADMIN" && (
            <div>
                
            </div>
        )}
    </div>
  )
}
