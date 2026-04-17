import AdminRequestFeed from "@/components/admin/AdminRequestFeed"
import AdminRequestPreview from "@/components/admin/AdminRequestPreview"

export default function AdminRequestsPage() {
  return (
    <section className="flex flex-col lg:flex-row w-full" style={{ height: "calc(100vh - 3.5rem)" }}>
      <section className="w-full lg:w-80 shrink-0 border-b lg:border-b-0 lg:border-r border-border overflow-y-auto">
        <AdminRequestFeed />
      </section>
      <section className="flex-1 min-w-0 overflow-y-auto">
        <AdminRequestPreview />
      </section>
    </section>
  )
}
