import AdminApprovedFeed from "@/components/admin/AdminApprovedFeed"
import AdminApprovedPreview from "@/components/admin/AdminApprovedPreview"

export default function AdminApprovedPage() {
  return (
    <section
      className="flex flex-col lg:flex-row w-full"
      style={{ height: "calc(100vh - 3.5rem)" }}
    >
      <aside className="w-full lg:w-96 shrink-0 border-b lg:border-b-0 lg:border-r border-border overflow-y-auto">
        <AdminApprovedFeed />
      </aside>
      <main className="flex-1 min-w-0 overflow-y-auto">
        <AdminApprovedPreview />
      </main>
    </section>
  )
}
