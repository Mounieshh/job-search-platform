const steps = [
  {
    index: "01",
    title: "Discover vetted jobs",
    content:
      "Every listing on Vettd is reviewed by a community Lead before it goes live. No spam, no duplicates — just roles worth your time.",
  },
  {
    index: "02",
    title: "Understand the full picture",
    content:
      "Listings include role details, requirements, and direct links to the original source. You get context, not just a title and a link.",
  },
  {
    index: "03",
    title: "Learn from the community",
    content:
      "Members share insights about roles, companies, and interview experiences. The community's knowledge compounds over time.",
  },
]

const AboutSection = () => {
  return (
    <section className="w-full py-16 sm:py-20">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">

        <div className="max-w-xl">
          <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            <span
              className="inline-block h-px w-6 bg-primary"
              aria-hidden="true"
            />
            How it works
          </p>
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] tracking-tight text-foreground font-extrabold">
            Quality over quantity,<br />every time.
          </h2>
          <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-muted-foreground">
            Vettd's lead system means every job you see has been reviewed by someone who knows what a good listing looks like.
          </p>
        </div>

        <ol className="mt-14 space-y-0 divide-y divide-border" aria-label="How Vettd works">
          {steps.map((step) => (
            <li
              key={step.index}
              className="group grid grid-cols-[3rem_1fr] gap-6 py-8 sm:grid-cols-[4rem_1fr] sm:gap-10 lg:grid-cols-[4rem_1fr_auto]"
            >
              <span
                className="font-display text-[2rem] leading-none text-primary/40 transition-colors duration-200 group-hover:text-primary sm:text-[2.5rem] font-extrabold"
                aria-hidden="true"
              >
                {step.index}
              </span>

              <div className="min-w-0">
                <h3 className="text-base font-semibold text-foreground sm:text-lg">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {step.content}
                </p>
              </div>
            </li>
          ))}
        </ol>

      </div>
    </section>
  );
};

export default AboutSection;
