import AdminRequestFeed from "@/components/admin/AdminRequestFeed";
import AdminRequestPreview from "@/components/admin/AdminRequestPreview";

export default function AdminRequestsPage() {
  return (
    <section className="w-full flex flex-row">
      <section className="w-1/3">
          <AdminRequestFeed/>
      </section>
      <section className="w-2/3 border-l h-[80vh]">
          <AdminRequestPreview/>
      </section>
    </section>
  )
}
