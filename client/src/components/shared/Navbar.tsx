import { useLogout, useSession } from "@/hooks/queries/auth"
import { Link, useNavigate } from "react-router"
import { Button } from "../ui/button"
import { ArrowRight, Menu, X } from "lucide-react"
import { getTopNavJobItems, NavigationDropdown, type Role } from "./NavigationDropdown"
import { useState } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"

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

  const initial = user?.name?.charAt(0)?.toUpperCase() || "U"

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/20 bg-white/10 backdrop-blur-3xl supports-backdrop-filter:bg-white/10 shadow-sm">
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
              {user && (
                <>
                  <NavigationDropdown role={role} />
                </>
              )}
            </li>
            
            <li>
              <Link to="/joblistings" className="hover:text-gray-600 transition-colors">Browse Jobs</Link>
            </li>
            { user && (
              <>
                <li>
                  <Link to="/postjob" className="hover:text-gray-600 transition-colors">Post</Link>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="hidden md:flex gap-5 items-center">
          {user ? (
            <>
              <Link to="/profile"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D4903A] bg-muted text-xl font-semibold text-foreground"
              >
                {initial}
              </Link>
              <div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild className="cursor-pointer">
                      <Button> Logout </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="font-bold italic">
                          Sure to Logout
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          You will be signed out of your account.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLogout} className="cursor-pointer">Logout</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
              </div>
            </>
          ) : (
            <>
              <Link to="/auth/login" className="p-1 hover:text-gray-600 transition-colors">
                Sign in
              </Link>
              <Link
                to="/auth/register"
                className="px-3 rounded-sm flex flex-row p-1 text-white bg-primary hover:bg-gray-800 transition-colors"
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
                  className="px-3 rounded-sm flex flex-row p-1 text-white bg-primary w-fit"
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
