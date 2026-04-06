import LeadApprovalFeed from '@/components/leadSystem/LeadApprovalFeed'
import LeadApprovalPreview from '@/components/leadSystem/LeadApprovalPreview'
import { useParams } from 'react-router'

export default function LeadApprovalPage() {
  const { jobId } = useParams()

  return (
    <section className="w-full flex lg:flex-row h-[calc(100vh-160px)] overflow-hidden">
        <section className={`w-full lg:w-1/3 overflow-y-auto pr-2 custom-scrollbar ${jobId ? 'hidden lg:block' : 'block'}`}>
              <LeadApprovalFeed/>
        </section>
        <section className={`w-full lg:w-2/3 overflow-y-auto lg:border-l lg:pl-4 ${jobId ? 'block' : 'hidden lg:block'}`}>
              <LeadApprovalPreview/>
        </section>
    </section>
  )
}
