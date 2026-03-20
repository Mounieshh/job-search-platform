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
    <main className="min-h-screen flex flex-col space-y-5">
      <h2 className="text-sm font-bold text-center mt-10 border rounded-lg mx-auto p-1">About the Community</h2>

      <div className="text-center text-6xl">
        <h3>
          How this community
        </h3>
        <h3>
          Help you <span className="font-serif italic ">grooow</span>
        </h3>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-20 justify-items-center">
        {cardContent.map((detail) => (
          <Card key={detail.id} className="w-90">
            <CardHeader className="flex flex-col items-center">

              <div className="h-64 w-64 flex justify-center items-center overflow-hidden">
                <img
                  src={detail.imgSrc}
                  alt={detail.alt}
                  className="max-w-full max-h-full object-contain block"
                />
              </div>

              <CardTitle>
                {detail.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="text-justify">
              {detail.content}
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  )
}

export default AboutSection