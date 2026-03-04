
import RoleSidebar from "@/components/sidebar"
import { useAuth } from "@/context/AuthContext"

export default function HomePage() {

  const { user } = useAuth()
  return (
    <div className="mt-20">
        {user && user?.role === "USER" && (
          <>  
            <div>
              <RoleSidebar/>
            </div>
          </>
        )}

        
    </div>
  )
}
