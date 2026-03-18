import UserProfile from "@/components/user/UserProfile"
import { useSession } from "@/hooks/queries/auth"

export default function ProfilePage() {

  const { data: user } = useSession()

  return (
    <div>
        {user?.role === "USER" && (
          <>
            <div>
              <UserProfile/>
            </div>
          </>
        )}
    </div>
  )
}
