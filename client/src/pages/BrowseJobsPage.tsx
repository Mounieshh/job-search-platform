import JobsFeed from "@/components/browseJobs/JobsFeed";
import JobsPreview from "@/components/browseJobs/JobsPreview";
import { useParams } from "react-router";

export default function BrowseJobsPage() {
  const { jobId } = useParams();

  return (
    <div className="w-full flex flex-col lg:flex-row gap-4 h-[calc(100vh-160px)] overflow-hidden">
      <section
        className={`w-full lg:w-1/3 overflow-y-auto pr-2 ${jobId ? "hidden lg:block" : "block"}`}
        aria-label="Job listings"
      >
        <JobsFeed />
      </section>
      <section
        className={`w-full lg:w-2/3 overflow-y-auto lg:border-l lg:pl-4 ${jobId ? "block" : "hidden lg:block"}`}
        aria-label="Job details"
      >
        <JobsPreview />
      </section>
    </div>
  );
}
