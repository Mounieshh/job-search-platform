import { useSession } from "@/hooks/queries/auth";
import { Link } from "react-router";

export default function HeroSection() {

    const { data: user } = useSession()
    const centerBlockIndexes = [4, 5, 6, 7]
    const roleText = user?.role === "USER" || user?.role === "LEAD" ? user.role : ""

  return (
    <header className="flex flex-col md:flex-row justify-between w-full">
        <section className="w-full md:w-1/2 flex flex-col justify-center items-start p-5 m-3 md:m-5">

                {user && user.role === "USER" ? (
                        <>
                            <h1 className="text-3xl md:text-5xl uppercase font-mono">
                                Job Search, 
                            </h1>
                            <h2 className="text-3xl md:text-5xl uppercase font-mono mb-3">
                                In a new way
                            </h2>
                            <p className="font-normal text-base md:text-lg text-left mb-5">
                                Move beyond the traditional job board. Join a developer-first 
                                community where referrals and direct company connections 
                                drive your career forward.
                            </p>
                        </>
                ): (
                    <>
                        <h1 className="text-3xl md:text-5xl uppercase font-mono">
                            Want a Movement
                        </h1>
                        <h2 className="text-3xl md:text-5xl uppercase font-mono mb-3">
                            Try our Community
                        </h2>
                        <p className="font-normal text-base md:text-lg text-left mb-5">
                            Move beyond the traditional job board. Join a developer-first 
                            community where referrals and direct company connections 
                            drive your career forward.
                        </p>
                    </>
                )}
            
            <div className="flex flex-wrap gap-4">
                { user ? (
                    <div className="flex flex-wrap gap-4">
                        <Link to={`/joblistings`} className="rounded-none border-2 border-border p-2 text-sm uppercase">
                            View Jobs
                        </Link>
                        <Link to={`/community`} className="rounded-none border-2 border-border p-2 text-sm uppercase">
                            Join Community
                        </Link>
                    </div>
                ) :(
                    <div className="flex flex-wrap gap-4">
                        <Link to={`/login`} className="rounded-none border-2 border-border p-2 text-sm uppercase hover:bg-teal-50">
                            View Jobs
                        </Link>
                        <Link to={`/login`} className="rounded-none border-2 border-border p-2 text-sm uppercase hover:bg-teal-50">
                            Join Community
                        </Link>
                    </div>
                )}
            </div>
        </section>
        <div className="hidden md:grid h-[80vh] md:w-1/2 border-2 border-border relative overflow-hidden grid-cols-4 gap-px bg-border">
            {Array.from({ length: 12 }).map((_, i) => (
                <div 
                key={i} 
                className="aspect-square w-full h-full bg-white flex items-center justify-center font-mono text-lg text-muted-foreground hover:bg-emerald-50 transition-colors"
                >
                {roleText && centerBlockIndexes.includes(i) ? roleText[i - centerBlockIndexes[0]] : ""}
                </div>
            ))}
        </div>
    </header>
  )
}
