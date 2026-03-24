
import AboutSection from "@/components/shared/AboutSection"
import HeroSection from "../components/shared/HeroSection"
import { useSession } from "@/hooks/queries/auth"

export default function HeroPage() {

  const { data: user } = useSession()
  return (
    <div>

      {!user && (
        <>
        <HeroSection/>

        <div className="border-b mt-20"/>

        <AboutSection/>
        
        </>
      )}
    </div>
  )
}
