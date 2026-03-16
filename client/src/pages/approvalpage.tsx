import ApprovalCard from "@/components/admin/ApprovalCard"
import TrackMyPosts from "@/components/user/TrackMyPosts"
import { useSession } from "@/hooks/queries/auth"

export default function ApprovalPage() {
    const { data: user } = useSession()

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
