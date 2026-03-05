import ApprovedCard from "@/components/admin/approved-card"
import { useAuth } from "@/context/AuthContext"

export default function ApprovePage() {

    const { user } = useAuth()
  return (
    <div>
        {user && user.role === "ADMIN" && (
            <div>
                <ApprovedCard/>
            </div>
        )}
    </div>
  )
}
