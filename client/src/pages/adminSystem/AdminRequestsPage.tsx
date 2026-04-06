import AdminRequestFeed from "@/components/admin/AdminRequestFeed";
import AdminRequestPreview from "@/components/admin/AdminRequestPreview";

export default function AdminRequestsPage() {
  return (
    <section className="w-full flex flex-col lg:flex-row">
      <section className="w-full lg:w-1/3">
          <AdminRequestFeed/>
      </section>
      <section className="w-full lg:w-2/3 lg:border-l h-[80vh]">
          <AdminRequestPreview/>
      </section>
    </section>
  )
}
