import UserProfile from "@/components/user/UserProfile"
import { useSession } from "@/hooks/queries/auth"

export default function ProfilePage() {
  const { data: user } = useSession()
  if (!user) return null
  return <UserProfile />
}
