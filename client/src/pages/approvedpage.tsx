import ApprovedCard from "@/components/admin/ApprovedCard"
import { useSession } from "@/hooks/queries/auth"

export default function ApprovePage() {

    const { data: user } = useSession()
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
