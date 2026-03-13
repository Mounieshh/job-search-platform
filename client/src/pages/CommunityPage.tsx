import CommunityPost from "@/components/community/CommunityPost"
import CommunityPostList from "@/components/community/CommunityPostList"
import { useAuth } from "@/context/AuthContext"

export default function CommunityPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      {user && user.role === "USER" && (
        <div className="w-full max-w-2xl border-x-2 border-border bg-card min-h-screen flex flex-col">
          
          <div className="p-5 border-b-2 border-border"> 
            <div className="border-2 border-border p-2 bg-card">
              Search Bar
            </div>
          </div>

          <div className="p-5 flex-1">
            <CommunityPost />
          </div>


          <div className="p-5 flex-1">
                <CommunityPostList/>
          </div>
          
        </div>
      )}
    </div>
  )
}