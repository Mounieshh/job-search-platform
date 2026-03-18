import { useSession } from "@/hooks/queries/auth";
import { Link } from "react-router";

export default function HeroSection() {

    const { data: user } = useSession()
    const centerBlockIndexes = [4, 5, 6, 7]
    const roleText = user?.role === "USER" || user?.role === "LEAD" ? user.role : ""

  return (
    <header className="relative w-full overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 " />
        <div className="relative mx-auto flex w-full max-w-7xl flex-col md:flex-row justify-between gap-6 px-4 py-6 md:px-6 md:py-8">
        <section className="w-full md:w-1/2 flex flex-col justify-center items-start rounded-none border border-border/60 p-6 md:p-10 backdrop-blur-sm">
                <div className="mb-5 inline-flex items-center gap-2 rounded-none border border-border/70 bg-background px-3 py-1 text-xs font-mono uppercase tracking-[0.28em] text-muted-foreground">
                    Developer hiring network
                </div>

                {user && user.role === "USER" ? (
                        <>
                            <h1 className="max-w-xl text-3xl font-mono uppercase leading-tight tracking-tight md:text-5xl">
                                Job Search, 
                            </h1>
                            <h2 className="max-w-xl text-3xl font-mono uppercase leading-tight tracking-tight md:text-5xl mb-3">
                                In a new way
                            </h2>
                            <p className="max-w-xl font-normal text-base md:text-lg leading-7 text-justify text-muted-foreground mb-6">
                                Move beyond the traditional job board. Join a developer-first 
                                community where referrals and direct company connections 
                                drive your career forward.
                            </p>
                        </>
                ): (
                    <>
                        <h1 className="max-w-xl text-3xl font-mono uppercase leading-tight tracking-tight md:text-5xl">
                            Want a Career
                        </h1>
                        <h2 className="max-w-xl text-3xl font-mono uppercase leading-tight tracking-tight md:text-5xl mb-3">
                            Try our Community
                        </h2>
                        <p className="max-w-xl font-normal text-base md:text-lg leading-7 text-justify text-muted-foreground mb-6">
                            Move beyond the traditional job board. Join a developer-first 
                            community where referrals and direct company connections 
                            drive your career forward.
                        </p>
                    </>
                )}
            

            <div className="flex flex-wrap gap-4">
                { user ? (
                    <div className="flex flex-wrap gap-4">
                        <Link to={`/joblistings`} className="rounded-none border-2 border-border bg-foreground px-5 py-3 text-sm uppercase font-semibold text-background transition-colors hover:bg-background hover:text-foreground">
                            View Jobs
                        </Link>
                        <Link to={`/community`} className="rounded-none border-2 border-border px-5 py-3 text-sm uppercase font-semibold transition-colors hover:bg-teal-50">
                            Jump into the space
                        </Link>
                    </div>
                ) :(
                    <div className="flex flex-wrap gap-4">
                        <Link to={`/login`} className="rounded-none border-2 border-border bg-foreground px-5 py-3 text-sm uppercase font-semibold text-background transition-colors hover:bg-background hover:text-foreground">
                            View Jobs
                        </Link>
                        <Link to={`/login`} className="rounded-none border-2 border-border px-5 py-3 text-sm uppercase font-semibold transition-colors hover:bg-teal-50">
                            Jump into the space
                        </Link>
                    </div>
                )}
            </div>
        </section>
        <div className="hidden md:grid h-[80vh] md:w-1/2 border-2 border-border relative overflow-hidden grid-cols-4 gap-px bg-border">
            {Array.from({ length: 12 }).map((_, i) => (
                <div 
                key={i} 
                className="aspect-square w-full h-full bg-white flex items-center justify-center font-mono text-[10px] text-muted-foreground hover:bg-emerald-50 transition-colors"
                >
                {roleText && centerBlockIndexes.includes(i) ? roleText[i - centerBlockIndexes[0]] : ""}
                </div>
            ))}
        </div>
        </div>
    </header>
  )
}
