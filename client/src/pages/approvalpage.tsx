import ApprovalCard from "@/components/admin/ApprovalCard"
import TrackMyPosts from "@/components/user/TrackMyPosts"
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
            <TrackMyPosts/>
          </div>
        )}

    </div>
  )
}
