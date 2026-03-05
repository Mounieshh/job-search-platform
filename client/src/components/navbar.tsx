import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router";
import { Button } from "./ui/button";

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-12 flex items-center justify-between bg-background border-b border-border">
      <Link to="/" className="h-full flex items-center px-6 text-foreground font-semibold tracking-tight text-lg border-border">
        Jobbify
      </Link>

      <div className="flex items-center h-full">
        {!user ? (
          <>
            <Link
              to="/login"
              className="h-full flex items-center px-5 text-sm font-medium text-muted-foreground hover:text-foreground border-l border-border transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="h-full flex items-center px-5 text-sm font-medium bg-foreground text-background hover:opacity-90 transition-opacity"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <span className="px-4 text-sm text-muted-foreground">{user.name}</span>
            <Button
              onClick={handleLogout}
              className="h-full px-5 text-sm font-medium bg-foreground text-background hover:opacity-90 cursor-pointer transition-opacity rounded-none"
            >
              Logout
            </Button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar;