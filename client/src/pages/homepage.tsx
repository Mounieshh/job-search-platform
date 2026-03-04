import { useAuth } from "@/context/AuthContext"

export default function HomePage() {

  const { user } = useAuth()
  return (
    <div className="mt-20">
        {user && (
          <>  

          <div>
            Job Search Community Welcomes <span className="font-bold">{user.name}</span>
          </div>
          </>
          
        )}
    </div>
  )
}
