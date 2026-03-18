import JobApproved from "@/components/admin/JobApproved"
import { useSession } from "@/hooks/queries/auth"

export default function ApprovePage() {

    const { data: user } = useSession()
  return (
    <div>
        {user && user.role === "ADMIN" && (
            <div>
                <JobApproved/>
            </div>
        )}
    </div>
  )
}
