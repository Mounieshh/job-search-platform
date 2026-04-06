import JobsFeed from "@/components/browseJobs/JobsFeed";
import JobsPreview from "@/components/browseJobs/JobsPreview";

export default function BrowseJobsPage() {
  return (
    <div className="w-full flex flex-col lg:flex-row gap-4 h-[calc(100vh-160px)] overflow-hidden">
      <section className="w-full lg:w-1/3 overflow-y-auto pr-2 custom-scrollbar">
        <JobsFeed />
      </section>
      <section className="w-full lg:w-2/3 overflow-y-auto lg:border-l lg:pl-4">
        <JobsPreview />
      </section>
    </div>
  );
}
