import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router";

const RoleNavbar = () => {

  const { user } = useAuth()

  return (
    <nav className="fixed top-12 left-0 right-0 z-40 h-10 flex items-center bg-background/80 backdrop-blur-sm border-b border-border overflow-x-auto">
      <ul className="flex flex-row h-full min-w-max">

        {user && (

          <>
            <li className="h-full">
              <Link
                to="/postjob"
                className="flex items-center h-full px-6 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent border-r border-border transition-colors"
              >
                Post Job
              </Link>
          </li>
          
          {user.role === "USER" && (

            <>
              <li className="h-full">
                <Link
                  to="/profile"
                  className="flex items-center h-full px-4 sm:px-6 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent border-r border-border transition-colors whitespace-nowrap"
                >
                  Profile
                </Link>
            </li>
            <li className="h-full">
                <Link
                  to="/approval-process"
                  className="flex items-center h-full px-4 sm:px-6 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent border-r border-border transition-colors whitespace-nowrap"
                >
                  Approval Process
                </Link>
            </li>
            </>
          )}

          {user.role === "ADMIN" && (

            <>
              <li className="h-full">
                <Link
                  to="/newrequest"
                  className="flex items-center h-full px-4 sm:px-6 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent border-r border-border transition-colors whitespace-nowrap"
                >
                  Job Requests
                </Link>
            </li>

            <li className="h-full">
                <Link
                  to="/approved"
                  className="flex items-center h-full px-4 sm:px-6 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent border-r border-border transition-colors whitespace-nowrap"
                >
                  Approved Jobs
                </Link>
            </li>

            <li className="h-full">
                <Link
                  to="/company"
                  className="flex items-center h-full px-4 sm:px-6 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent border-r border-border transition-colors whitespace-nowrap"
                >
                  Company List
                </Link>
            </li>
            </>
            
          )}

          {user.role === "LEAD" && (
            <>
              <li className="h-full">
                <Link
                  to="/lead-approval"
                  className="flex items-center h-full px-4 sm:px-6 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent border-r border-border transition-colors whitespace-nowrap"
                >
                  Approval
                </Link>
            </li>
            </>
          )}
          </>

        )}
        
        <li className="h-full">
          <Link
            to="/joblistings"
            className="flex items-center h-full px-4 sm:px-6 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent border-r border-border transition-colors whitespace-nowrap"
          >
            Browse Jobs
          </Link>
        </li>

        
      </ul>
    </nav>
  );
};

export default RoleNavbar;