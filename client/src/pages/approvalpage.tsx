import ApprovalCard from "@/components/admin/approval-card"
import { useAuth } from "@/context/AuthContext"

export default function ApprovalPage() {
    const { user } = useAuth()

  return (
    <div>
        {user && user.role === "ADMIN" && (
            <div>
                <ApprovalCard/>
            </div>
        )}
    </div>
  )
}
