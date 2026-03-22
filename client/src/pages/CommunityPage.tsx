import CommunityPost from "@/components/community/CommunityPost"
import CommunityPostList from "@/components/community/CommunityPostList"
import { useCommunityPosts } from "@/hooks/queries/community"

export default function CommunityPage() {
  const { data = [] } = useCommunityPosts()
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  })

  return (
    <main className="min-h-screen bg-[#fcfcfb] text-zinc-800">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-[220px_minmax(0,1fr)_220px] xl:gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-3 rounded-md border border-zinc-200 bg-white p-4">
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

        <section className="mx-auto w-full max-w-3xl space-y-6">
          <header className="rounded-md border border-zinc-200 bg-white px-5 py-4">
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Community Feed</p>
            <div className="mt-2 flex items-center justify-between gap-4">
              <h1 className="text-xl font-semibold text-zinc-900">Write and read together</h1>
              <span className="text-sm text-zinc-500">{today}</span>
            </div>
          </header>

          <div className="rounded-md border border-zinc-200 bg-white p-4 sm:p-5">
            <CommunityPost/>
          </div>

          <div className="border-b border-zinc-200"/>

          <CommunityPostList/>
        </section>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4 rounded-md border border-zinc-200 bg-white p-4">
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