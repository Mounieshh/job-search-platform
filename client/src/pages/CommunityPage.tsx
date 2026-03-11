import CommunityPost from "@/components/user/CommunityPost"
import { useAuth } from "@/context/AuthContext"

export default function CommunityPage() {

  const { user } = useAuth()
  return (
    <div>
        {user && user.role === "USER" && (
          <div>
            <CommunityPost/>
          </div>
        )}
    </div>
  )
}
