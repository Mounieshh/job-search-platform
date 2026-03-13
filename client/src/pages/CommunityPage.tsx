import CommunityPost from "@/components/community/CommunityPost"
import CommunityPostList from "@/components/community/CommunityPostList"

export default function CommunityPage() {

  return (
    <div className="min-h-screen bg-background flex justify-center">
        <div className="w-full max-w-2xl border-x-2 border-border bg-card min-h-screen flex flex-col">
          
          <div className="p-5 flex-1">
            <CommunityPost />
          </div>


          <div className="p-5 flex-1">
                <CommunityPostList/>
          </div>
          
        </div>
    </div>
  )
}