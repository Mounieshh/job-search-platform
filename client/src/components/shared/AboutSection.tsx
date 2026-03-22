import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

const cardContent = [
  {
    id: 1,
    imgSrc: "https://res.cloudinary.com/dxhree9z7/image/upload/v1773993052/discover_hrsdnp.png",
    alt: "Search Jobs",
    title: "Discover Jobs",
    content: "Find opportunities that match your skills with clearly structured listings and relevant job details.",
  },
  {
    id: 2,
    imgSrc: "https://res.cloudinary.com/dxhree9z7/image/upload/v1773993053/information_g1ki6v.png",
    alt: "Information Spread",
    title: "Stay Informed",
    content: "Get a clear overview of roles, requirements, and sources so you can confidently navigate to the original application pages.",
  },
  {
    id: 3,
    imgSrc: "https://res.cloudinary.com/dxhree9z7/image/upload/v1773993052/learn_iwjfhv.png",
    alt: "Learnings",
    title: "Learn from Others",
    content: "Access community-driven insights about roles, companies, and interview experiences.",
  },
]

const AboutSection = () => {
  return (
    <main className="w-full py-12 sm:py-16">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex rounded-md border border-border bg-muted/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            About the community
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            <span className="block">How this community</span>
            <span className="block">Help you <span className="font-serif italic">grooow</span></span>
          </h2>
        </div>

        <section className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
        {cardContent.map((detail) => (
          <Card key={detail.id} className="h-full rounded-xl border border-border bg-card shadow-none">
            <CardHeader className="space-y-4">
              <div className="flex aspect-4/3 w-full items-center justify-center overflow-hidden rounded-md border border-border bg-muted/30 p-4">
                <img
                  src={detail.imgSrc}
                  alt={detail.alt}
                  className="h-full w-full object-contain"
                />
              </div>

              <CardTitle className="text-lg font-semibold text-foreground">
                {detail.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="text-sm leading-7 text-muted-foreground">
              {detail.content}
            </CardContent>
          </Card>
        ))}
        </section>
      </div>
    </main>
  )
}

export default AboutSection