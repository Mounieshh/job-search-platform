import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router";

const RoleNavbar = () => {
  const { user } = useAuth();

  return (

    <nav className="fixed top-12 left-0 bottom-0 z-40 w-48 flex flex-col bg-background/80 backdrop-blur-sm border-r border-border overflow-y-auto">
      <ul className="flex flex-col w-full">
        {user && (
          <>
            <li className="w-full">
              <Link
                to="/postjob"
                className="flex items-center w-full h-12 px-6 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent border-b border-border transition-colors"
              >
                Post Job
              </Link>
            </li>

            {user.role === "USER" && (
              <>

              <li className="w-full">
                  <Link
                    to="/"
                    className="flex items-center w-full h-12 px-6 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent border-b border-border transition-colors whitespace-nowrap"
                  >
                    Community
                  </Link>
                </li>
                <li className="w-full">
                  <Link
                    to="/profile"
                    className="flex items-center w-full h-12 px-6 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent border-b border-border transition-colors whitespace-nowrap"
                  >
                    Profile
                  </Link>
                </li>
                <li className="w-full">
                  <Link
                    to="/my-posts"
                    className="flex items-center w-full h-12 px-6 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent border-b border-border transition-colors whitespace-nowrap"
                  >
                    Track My Posts
                  </Link>
                </li>
              </>
            )}

            {user.role === "ADMIN" && (
              <>
                <li className="w-full">
                  <Link
                    to="/newrequest"
                    className="flex items-center w-full h-12 px-6 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent border-b border-border transition-colors whitespace-nowrap"
                  >
                    Job Requests
                  </Link>
                </li>
                <li className="w-full">
                  <Link
                    to="/approved"
                    className="flex items-center w-full h-12 px-6 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent border-b border-border transition-colors whitespace-nowrap"
                  >
                    Approved Jobs
                  </Link>
                </li>
                <li className="w-full">
                  <Link
                    to="/company"
                    className="flex items-center w-full h-12 px-6 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent border-b border-border transition-colors whitespace-nowrap"
                  >
                    Company List
                  </Link>
                </li>
              </>
            )}

            {user.role === "LEAD" && (
              <li className="w-full">
                <Link
                  to="/lead-approval"
                  className="flex items-center w-full h-12 px-6 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent border-b border-border transition-colors whitespace-nowrap"
                >
                  Approval
                </Link>
              </li>
            )}
          </>
        )}

        <li className="w-full">
          <Link
            to="/joblistings"
            className="flex items-center w-full h-12 px-6 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent border-b border-border transition-colors whitespace-nowrap"
          >
            Browse Jobs
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default RoleNavbar;