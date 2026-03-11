
import RoleNavbar from "@/components/RoleNavbar"
import { useAuth } from "@/context/AuthContext"

export default function HomePage() {

  const { user } = useAuth()
  return (
    <div className="mt-20">
        {user && (
          <>  
            <div>
              <RoleNavbar/>
            </div>
          </>
        )}

        {user && user.role === "USER" && (
          <>
            <div>
              Show Job Listings 
            </div>
          </>
        )}
        
    </div>
  )
}
