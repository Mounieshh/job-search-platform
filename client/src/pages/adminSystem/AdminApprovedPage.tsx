import AdminApprovedFeed from "@/components/admin/AdminApprovedFeed";
import AdminApprovedPreview from "@/components/admin/AdminApprovedPreview";

export default function AdminApprovedPage() {
  return (
    <section className="w-full flex flex-col lg:flex-row">
            <section className="w-full lg:w-1/3">
              <AdminApprovedFeed/>
            </section>
            <section className="w-full lg:w-2/3 lg:border-l">
              <AdminApprovedPreview/>
            </section>
    </section>
  )
}
