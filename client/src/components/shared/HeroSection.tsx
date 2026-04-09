import { Link } from "react-router";

export default function HeroSection() {

  return (
    <header className="w-full min-h-105 md:min-h-150 flex justify-center">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-12">
        <section className="order-2 space-y-5 text-center md:text-left lg:order-1">
         
          <h2 className="italic font-ubuntu text-3xl font-semibold leading-tight text-foreground sm:text-4xl lg:text-8xl">
            Job search,
            <br />
            simplified.
          </h2>

          <p className="mx-auto max-w-xl leading-7 sm:text-base md:mx-0">
            Join a focused community where job listings and insights are shared in a clean, practical format.
          </p>

          <div className="pt-1 flex justify-center md:justify-start">
            <Link
              to="/browseJobs"
              className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium text-white bg-primary transition-colors hover:bg-mute"
            >
              View jobs
            </Link>
          </div>
        </section>

        <section className="order-1 lg:order-2">
          <div className="overflow-hidden rounded-xl border border-border bg-card p-2 sm:p-3">
            <img
              src="https://res.cloudinary.com/dxhree9z7/image/upload/v1773993052/hero_image_iamhsh.png"
              alt="Job search illustration"
              className="h-72 w-full rounded-lg object-cover sm:h-80 lg:h-96"
            />
          </div>
        </section>
      </div>
    </header>
  )
}
