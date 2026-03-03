import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router";


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
    <nav className="flex flex-row justify-between p-5 border-b-2 mb-10">
      <div>Job Search Com</div>

      <div>
        <ul className="flex flex-row gap-6">
          {!user && (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}

          {user && (
            <>
              <li>{user?.name}</li>
              <li>{user?.role}</li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;