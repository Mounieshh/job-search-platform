import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router";
import { Button } from "./ui/button";

const Navbar = () => {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-white border-b border-zinc-200">

      <Link to="/" className="text-zinc-900 font-semibold tracking-tight text-2xl">
        Jobbify
      </Link>

      <ul className="flex items-center gap-6 text-sm">
        {!user && (
          <>
            <li>
              <Link to="/login" className="text-zinc-500 hover:text-zinc-900 transition-colors">
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="bg-zinc-900 text-white px-4 py-2 rounded-lg hover:bg-zinc-700 transition-colors"
              >
                Register
              </Link>
            </li>
          </>
        )}

        {user && (
          <>
            <li className="text-zinc-500 text-sm">{user?.name}</li>
            <li>
              <Link to="/profile" className="text-zinc-500 hover:text-zinc-900 transition-colors">
                <Button className="text-sm bg-stone-600 hover:bg-stone-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer">
                    Profile
                </Button>
              </Link>
            </li>
            <li>
              <Button
                onClick={handleLogout}
                className="text-sm bg-stone-600 hover:bg-stone-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Logout
              </Button>
            </li>
          </>
        )}
      </ul>

    </nav>
  );
};

export default Navbar;