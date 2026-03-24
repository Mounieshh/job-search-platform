import JobList from "@/components/shared/JobList"
import JobDetailPage from "./JobDetailUserPage"
import { useParams } from "react-router"

export default function JobsPage() {
  const { companyName, slugId } = useParams()
  const hasSelectedJob = Boolean(companyName && slugId)

  return (
      <div className="flex flex-col md:flex-row w-full min-h-0 md:h-[calc(100dvh-8rem)] gap-4 p-4 items-stretch">

        <section className={`${hasSelectedJob ? 'hidden md:block md:w-1/3 md:max-h-[calc(100dvh-8rem)] md:overflow-y-auto' : 'w-full md:w-1/3 md:max-h-[calc(100dvh-8rem)] md:overflow-y-auto'}`}>
          <JobList />
        </section>

        <section className={`${hasSelectedJob ? 'w-full md:w-2/3 md:max-h-[calc(100dvh-8rem)] md:overflow-y-auto' : 'hidden md:block md:w-2/3 md:max-h-[calc(100dvh-8rem)] md:overflow-y-auto'}`}>
          {hasSelectedJob ? (
            <section className="h-full md:border-l border-border md:pl-4">
              <JobDetailPage />
            </section>
          ): (
            <section className="h-full md:border-l border-border md:pl-4 flex justify-center">
                <h2 className="">Click a job to view details</h2>
            </section>
          )}
        </section>
      </div>
  )
}