import ApprovalCard from "@/components/admin/approval-card"
import ApprovalProcess from "@/components/user/approval-process"
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

        {user && user.role === "USER" && (
          <div>
            <ApprovalProcess/>
          </div>
        )}
    </div>
  )
}
