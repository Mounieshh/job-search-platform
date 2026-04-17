import AboutSection from "@/components/shared/AboutSection"
import HeroSection from "@/components/shared/HeroSection"
import { useSession } from "@/hooks/queries/auth"

export default function HeroPage() {
  const { data: user } = useSession()
  if (user) return null

  return (
    <div className="-mx-3 -mt-4 sm:-mx-6 sm:-mt-6">
      <HeroSection />
      <div className="border-b border-border" />
      <AboutSection />
    </div>
  )
}
