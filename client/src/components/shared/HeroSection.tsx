import { Link } from "react-router";

export default function HeroSection() {
  return (
    <section className="flex min-h-150 flex-col items-center justify-center gap-6 px-4 py-12 text-center">
      <div className="leading-[0.95]">
        <h1 className="font-ubuntu font-bold text-[clamp(2rem,6vw,4.5rem)] uppercase tracking-tight text-foreground">
          Smarter Job Search
        </h1>
        <h1 className="font-ubuntu font-bold text-[clamp(2rem,6vw,4.5rem)] uppercase tracking-tight text-primary">
          <span className="text-black">with </span>COMMUNITY,
        </h1>
        <h1 className="font-ubuntu font-bold text-[clamp(2rem,6vw,4.5rem)] uppercase tracking-tight text-foreground">
          Done in Seconds
        </h1>
      </div>

      <p className="text-muted-foreground max-w-md text-base">
        Join a focused community where job listings and insights are shared in a clean, practical format.
      </p>

      <Link
        to="/browseJobs"
        className="inline-flex items-center gap-2 rounded bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        Browse Jobs
      </Link>
    </section>
  );
}