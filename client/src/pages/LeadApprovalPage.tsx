import LeadApprovalFeed from '@/components/leadSystem/LeadApprovalFeed'
import LeadApprovalPreview from '@/components/leadSystem/LeadApprovalPreview'

export default function LeadApprovalPage() {
  return (
    <section className='w-full flex flex-row'>
        <section className='w-1/3'>
              <LeadApprovalFeed/>
        </section>
        <section className='w-2/3'>
              <LeadApprovalPreview/>
        </section>
    </section>
  )
}
