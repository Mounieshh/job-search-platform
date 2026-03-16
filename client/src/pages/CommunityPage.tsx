import CommunityPost from "@/components/community/CommunityPost"
import CommunityPostList from "@/components/community/CommunityPostList"

export default function CommunityPage() {

  return (
    <div className="min-h-screen bg-background flex justify-center">
        <div className="w-full max-w-2xl border-x-2 border-border bg-card min-h-screen flex flex-col">
          <h2 className="text-2xl uppercase font-mono border-b-2">
            Community Posts
          </h2>
          
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