import AdminApprovedFeed from "@/components/admin/AdminApprovedFeed";
import AdminApprovedPreview from "@/components/admin/AdminApprovedPreview";


export default function AdminApprovedPage() {
  return (
    <section className="w-full flex flex-row">
            <section className="w-1/3">
              <AdminApprovedFeed/>
            </section>
            <section className="w-2/3 border-l">
              <AdminApprovedPreview/>
            </section>
    </section>
  )
}
