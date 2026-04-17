import { Link } from "react-router";

export default function HeroSection() {
  return (
    <section className="relative w-full px-4 py-16 sm:px-6 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-5xl">

        <p className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          <span
            className="inline-block h-px w-6 bg-primary"
            aria-hidden="true"
          />
          Community-vetted jobs
        </p>

        <h1 className="font-display text-[clamp(3rem,9vw,6.5rem)] leading-[0.92] tracking-tight text-foreground font-extrabold">
          <span className="block">Smarter job search,</span>
          <span className="block text-primary">built on trust.</span>
        </h1>

        <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
          Vettd is a focused community where job listings are reviewed by real professionals before they reach you. Less noise, more signal.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            to="/browseJobs"
            className="inline-flex items-center gap-2 rounded bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-all duration-150 ease-out hover:brightness-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Browse Jobs
          </Link>
          <Link
            to="/auth/register"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 underline-offset-4 transition-colors duration-150 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
          >
            Join the community
            <svg
              className="size-3.5"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2.5 6h7M6.5 3l3 3-3 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
