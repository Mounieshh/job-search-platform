import SignInForm from "@/components/auth/SignInForm";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen w-full -mx-3 -my-4 sm:-mx-6 sm:-my-6">
      <div
        className="hidden lg:flex lg:w-[45%] flex-col justify-between bg-foreground px-12 py-14"
        aria-hidden="true"
      >
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm bg-primary" />
          <span className="font-display font-extrabold text-lg text-background tracking-tight">Vettd</span>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-6">
            Community-vetted jobs
          </p>
          <h2 className="font-display font-extrabold text-[clamp(2.5rem,4vw,3.5rem)] leading-[0.95] text-background">
            Every job here<br />earned its place.
          </h2>
          <p className="mt-6 text-sm leading-relaxed max-w-[38ch] text-background/60">
            Listings reviewed by real professionals. No spam, no noise — just roles worth your time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-primary/20" />
          <span className="text-xs font-medium text-background/40">
            Trusted by tech professionals
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col min-w-0">
        <div className="lg:hidden flex items-center gap-2 px-6 pt-8 pb-0">
          <span className="inline-block h-2 w-2 rounded-sm bg-primary" aria-hidden="true" />
          <span className="font-display font-extrabold text-sm text-foreground tracking-tight">Vettd</span>
          <span className="ml-auto text-xs text-muted-foreground">Community-vetted jobs</span>
        </div>
        <SignInForm />
      </div>
    </main>
  );
}
