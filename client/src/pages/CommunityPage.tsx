import CommunityPost from "@/components/community/CommunityPost"
import CommunityPostList from "@/components/community/CommunityPostList"
import { useCommunityPosts } from "@/hooks/queries/community"

export default function CommunityPage() {
  const { data = [] } = useCommunityPosts()

  return (
    <main>
      <div className="mx-auto w-full max-w-6xl flex flex-col gap-6 lg:flex-row lg:items-start">

        <aside className="hidden lg:block lg:w-56 lg:shrink-0">
          <div className="sticky top-6 space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-3">
                Community
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                A focused feed for job-search notes, wins, and lessons from the community.
              </p>
            </div>
            <div className="border-t border-border pt-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total posts</span>
                <span className="font-semibold text-foreground tabular-nums">{data.length}</span>
              </div>
            </div>
          </div>
        </aside>

        <section className="w-full min-w-0 flex-1 space-y-5">
          <CommunityPost />
          <div className="border-t border-border" />
          <CommunityPostList />
        </section>

        <aside className="hidden lg:block lg:w-52 lg:shrink-0">
          <div className="sticky top-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground mb-3">
              How to use
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Write a title and share your thoughts.</li>
              <li>Add images when they add context.</li>
              <li>Like posts that help you.</li>
            </ul>
            <p className="mt-4 text-xs text-muted-foreground/60">
              Keep it clear, short, and useful.
            </p>
          </div>
        </aside>

      </div>
    </main>
  )
}
