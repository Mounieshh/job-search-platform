import CommunityPost from "@/components/community/CommunityPost"
import CommunityPostList from "@/components/community/CommunityPostList"
import { useCommunityPosts } from "@/hooks/queries/community"

export default function CommunityPage() {
  const { data = [] } = useCommunityPosts()

  return (
    <main className="min-h-screen bg-[#fcfcfb] text-zinc-800">
      <div className="mx-auto w-full max-w-7xl flex flex-col gap-5 lg:flex-row lg:items-start">

        <aside className="hidden lg:block lg:basis-1/4 lg:max-w-xs lg:shrink-0">
          <div className="sticky top-24 space-y-3 rounded-md border bg-white p-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Community</h2>
            <p className="text-sm leading-6 text-zinc-600">
              A simple feed for shared job-search notes, wins, and lessons.
            </p>
            <div className="border-t border-zinc-200 pt-3 text-sm text-zinc-600">
              <div className="flex items-center justify-between">
                <span>Total posts</span>
                <span className="font-medium text-zinc-900">{data.length}</span>
              </div>
            </div>
          </div>
        </aside>

        <section className="w-full min-w-0 lg:flex-1 lg:max-w-3xl space-y-6">
          
          <div className="rounded-md border bg-white p-4 sm:p-5">
            <CommunityPost/>
          </div>

          <div className="border-b border-zinc-200"/>

          <CommunityPostList/>
        </section>

        <aside className="hidden lg:block lg:basis-1/4 lg:max-w-xs lg:shrink-0">
          <div className="sticky top-24 space-y-4 rounded-md border bg-white p-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">How To Use</h2>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>Create a post with a title and content.</li>
              <li>Add images when needed.</li>
              <li>Read posts and like what helps you.</li>
            </ul>
            <div className="border-t border-zinc-200 pt-3 text-xs text-zinc-500">
              Keep it clear, short, and useful.
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}