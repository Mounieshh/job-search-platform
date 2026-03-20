import { Link } from "react-router";

export default function HeroSection() {

  return (
    <header className="w-full flex">
        <section className="w-1/2 p-6 flex flex-col space-y-5 justify-center">
        <span className="border p-0.5 max-w-60 font-semibold text-muted-foreground">
          Connecting People to the world
        </span>
            <h2 className="italic text-5xl font-bold">
                Job Search —-
            </h2>
            <p className="mt-2 text-gray-600">
              Join our community to enhance and improve job searching for the{" "}
              <span className="font-semibold italic text-lg">next generation of professionals</span>
            </p>

            <div className="mt-5">
                <Link to="/joblistings" className="border p-1">
                  View Jobs
                </Link>
            </div>
            
        </section>
        
        <section className="w-1/2 p-6 flex items-center justify-center">
                <img src="https://res.cloudinary.com/dxhree9z7/image/upload/v1773993052/hero_image_iamhsh.png" alt="Hero Section Image" className="rounded-2xl"/>
        </section>
    </header>
  )
}
