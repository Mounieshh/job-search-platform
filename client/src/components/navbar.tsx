import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

interface User {
  id: string;
  name: string;
  role: string;
}

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const res = await fetch("http://localhost:5000/api/auth/me", {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    };

    getSession();
  }, []);

  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    navigate("/login");
  };

  return (
    <nav>
      <div>Job Search Com</div>

      <div>
        <ul>
          {!user && (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}

          {user && (
            <>
              <li>{user.name}</li>
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