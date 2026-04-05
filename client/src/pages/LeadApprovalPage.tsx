import LeadApprovalFeed from '@/components/leadSystem/LeadApprovalFeed'
import LeadApprovalPreview from '@/components/leadSystem/LeadApprovalPreview'

export default function LeadApprovalPage() {
  return (
    <section className="w-full flex flex-row gap-4 h-[calc(100vh-160px)] overflow-hidden">
        <section className="w-1/3 overflow-y-auto pr-2 custom-scrollbar">
              <LeadApprovalFeed/>
        </section>
        <section className="w-2/3 overflow-y-auto border-l pl-4">
              <LeadApprovalPreview/>
        </section>
    </section>
  )
}
