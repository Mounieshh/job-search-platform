import JobsFeed from "@/components/browseJobs/JobsFeed";
import JobsPreview from "@/components/browseJobs/JobsPreview";

export default function BrowseJobsPage() {
  return (
    <section className="w-full flex flex-row">
      <section className="w-1/3">
        <JobsFeed/>
      </section>
      <section className="w-2/3">
        <JobsPreview/>
      </section>
    </section>
  )
}
