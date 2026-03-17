import PendingJobApprovalCard from "@/components/admin/PendingJobApprovals"
import TrackMyPosts from "@/components/user/TrackMyPosts"
import { useSession } from "@/hooks/queries/auth"

export default function ApprovalPage() {
    const { data: user } = useSession()

  return (
    <div>
        {user && user.role === "ADMIN" && (
            <div>
                <PendingJobApprovalCard/>
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
