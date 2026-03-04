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
    <nav className="fixed top-0 left-0 right-0 z-50 h-12 flex items-center justify-between bg-background/80 backdrop-blur-sm border-b border-border">
      <Link to="/" className="text-foreground font-semibold tracking-tight text-xl px-8">
        Jobbify
      </Link>

      <div className="flex items-center gap-8 uppercase">
        {!user ? (
          <>
            <Button variant="ghost" size="sm" asChild className="p-5 rounded-none border-l-2 h-12 ml-2 justify-center">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button size="sm" asChild className="p-5 rounded-none border-l-2 h-12 ml-2 justify-center">
              <Link to="/register">Sign Up</Link>
            </Button>
          </>
        ) : (
          <>
            <span className="text-sm text-muted-foreground mr-2">{user.name}</span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="cursor-pointer p-5 rounded-none border-l-2 h-12 ml-2 justify-center bg-black text-white uppercase"
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