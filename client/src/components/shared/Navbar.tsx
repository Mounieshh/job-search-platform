import { useLogout, useSession } from "@/hooks/queries/auth"
import { Link, useNavigate } from "react-router"
import { Button } from "../ui/button"
import { ArrowRight, UserCircleIcon, Menu, X } from "lucide-react"
import { getTopNavJobItems, NavigationDropdown, type Role } from "./NavigationDropdown"
import { useState } from "react"

const Navbar = () => {
  const { data: user } = useSession()
  const { mutateAsync: logout } = useLogout()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const role = user?.role as Role | undefined
  const mobileJobItems = getTopNavJobItems(role)

  const handleLogout = async () => {
    await logout()
    navigate("/auth/login")
  }

  return (
    <nav className="flex flex-col">
      <div className="flex flex-row justify-between items-center p-5">
        <div>
          <h1 className="text-2xl ml-2 font-semibold uppercase italic">
            <Link to="/">Jobbify</Link>
          </h1>
        </div>

        <div className="hidden md:block">
          <ul className="flex flex-row gap-5 items-center">
            <li>
              <Link to="/" className="hover:text-gray-600 transition-colors">Home</Link>
            </li>
            <li>
              <NavigationDropdown role={role} />
            </li>
            <li>
              <Link to="/community" className="hover:text-gray-600 transition-colors">Community</Link>
            </li>
          </ul>
        </div>

        <div className="hidden md:flex gap-5 items-center">
          {user ? (
            <>
              <button
                onClick={() => navigate("/profile")}
                className="p-1 hover:opacity-70 transition-opacity cursor-pointer"
                aria-label="Go to profile"
              >
                <UserCircleIcon className="size-6" />
              </button>
              <Button
                onClick={handleLogout}
                className="rounded-sm flex flex-row p-3 text-white bg-black cursor-pointer hover:bg-gray-800 transition-colors"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth/login" className="p-1 hover:text-gray-600 transition-colors">
                Sign in
              </Link>
              <Link
                to="/auth/register"
                className="px-3 rounded-sm flex flex-row p-1 text-white bg-black hover:bg-gray-800 transition-colors"
              >
                Get started it's free
                <ArrowRight className="size-4 flex justify-center items-center mt-1 ml-1" />
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-1"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden flex flex-col gap-4 px-7 pb-5 border-t pt-4">
          <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
          {mobileJobItems.map((item) => (
            <Link key={item.href} to={item.href} onClick={() => setMobileOpen(false)}>
              {item.title}
            </Link>
          ))}
          <Link to="/community" onClick={() => setMobileOpen(false)}>Community</Link>
          <Link to="/profile" onClick={() => setMobileOpen(false)}>Profile</Link>

          <div className="border-t pt-4 flex flex-col gap-3">
            {user ? (
              <>
                <Button
                  onClick={async () => {
                    await handleLogout()
                    setMobileOpen(false)
                  }}
                  className="px-3 rounded-sm text-white bg-black w-fit"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth/login" onClick={() => setMobileOpen(false)}>Sign in</Link>
                <Link
                  to="/auth/register"
                  className="px-3 rounded-sm flex flex-row p-1 text-white bg-black w-fit"
                  onClick={() => setMobileOpen(false)}
                >
                  Get started it's free
                  <ArrowRight className="size-4 flex justify-center items-center mt-1 ml-1" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
