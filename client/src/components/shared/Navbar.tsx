import { useLogout, useSession } from "@/hooks/queries/auth"
import { Link } from "react-router"
import { Button } from "../ui/button"
import { ArrowRight } from "lucide-react"

const Navbar = () => {

  const { data: user } = useSession()
  const { mutateAsync: logout } = useLogout()

  return (
    <nav className="flex flex-row justify-between p-5">
        
        <div>
          <h1 className="text-2xl ml-2 font-semibold uppercase italic">
            <Link to="/">
                Jobbify
            </Link>
          </h1>
        </div>


        <div>
          <ul>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>

          {user ? (
            <>
              <div className="flex gap-5">
              <span>
                {user?.name}
              </span>
              <Button onClick={() => logout()}>
                  Logout
              </Button>
        </div>
            </>
          ) : (

            <>
              <div className="flex gap-5">
              <Link to={`/auth/login`} className="p-1" >
                  Sign in
              </Link>
              <Link to="/auth/register" className="px-3 rounded-sm flex flex-row p-1 text-white bg-black">
                  Get started it's free <ArrowRight className="size-4 flex justify-center items-center mt-1 ml-1"/>
              </Link>
        </div>
            </>
          )}
        
    </nav>
  )
}

export default Navbar