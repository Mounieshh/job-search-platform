import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router";

const RoleNavbarUser = () => {

  const { user } = useAuth()

  return (
    <nav className="fixed top-12 left-0 right-0 z-40 h-10 flex items-center bg-background/80 backdrop-blur-sm border-b border-border">
      <ul className="flex flex-row h-full">
        {user && (
          <li className="h-full">
          <Link
            to="/postjob"
            className="flex items-center h-full px-6 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent border-r border-border transition-colors"
          >
            Post Job
          </Link>
        </li>
        )}
        
        <li className="h-full">
          <Link
            to="/joblistings"
            className="flex items-center h-full px-6 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent border-r border-border transition-colors"
          >
            Browse Jobs
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default RoleNavbarUser;