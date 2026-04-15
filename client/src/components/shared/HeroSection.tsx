import { Link } from "react-router";

export default function HeroSection() {

  return (
    <section className="flex flex-col space-y-5 justify-center items-center min-h-150">
      <section className="text-center leading-[0.95]">
        <h2 className="font-ubuntu font-bold text-[clamp(2.8rem,8vw,6rem)] uppercase tracking-tight text-foreground">
          Smarter Job Search
        </h2>
        <h2 className="font-ubuntu font-bold text-[clamp(2.8rem,8vw,6rem)] uppercase tracking-tight text-primary">
          with AI,
        </h2>
        <h2 className="font-ubuntu font-bold text-[clamp(2.8rem,8vw,6rem)] uppercase tracking-tight text-foreground">
          Done in Seconds
        </h2>
      </section>

      <section>
        <p className="text-muted-foreground text-base text-center max-w-md">
          Join a focused community where job listings and insights are shared in a clean, practical format.
        </p>
      </section>

      <section>
        <Link
          to="/browseJobs"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-3 text-sm hover:opacity-90 transition-opacity"
        >
          Browse Jobs
        </Link>
      </section>
    </section>
  )
}
