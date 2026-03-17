import CommunityPost from "@/components/community/CommunityPost"
import CommunityPostList from "@/components/community/CommunityPostList"

export default function CommunityPage() {

  return (
    <div className="flex min-h-screen justify-center bg-background px-3 py-4 sm:px-6 sm:py-6">
        <div className="flex min-h-full w-full max-w-3xl flex-col border-x-2 border-border bg-card">
          <div className="border-b-2 border-border px-5 py-5 sm:px-6">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Community Space
              </p>
              <h2 className="text-2xl font-mono uppercase tracking-tight text-card-foreground">
                Community Posts
              </h2>
              <p className="text-sm text-muted-foreground">
                Share updates, questions, and thoughts with the community in one place.
              </p>
            </div>
          </div>

          <div className="border-b border-border bg-muted/20 p-5 sm:p-6">
            <CommunityPost />
          </div>

          <div className="flex-1 p-5 sm:p-6">
                <CommunityPostList/>
          </div>
          
        </div>
    </div>
  )
}