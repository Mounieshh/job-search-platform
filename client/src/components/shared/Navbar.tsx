import { useLogout, useSession } from "@/hooks/queries/auth"
import { Link, useNavigate } from "react-router"
import { ArrowRight, LogOutIcon, UserIcon} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"

const Navbar = () => {
  const { data: user } = useSession()
  const { mutateAsync: logout } = useLogout()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/auth/login")
  }

  const initial = user?.name?.charAt(0)?.toUpperCase() || "U"

  return (
    <>
     
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0E141E] border-b border-white/10 h-14">
        <div className="h-full max-w-screen-2xl mx-auto px-4 flex items-center justify-between gap-4">

          {/* LEFT — Logo + Nav links */}
          <div className="flex items-center gap-6 shrink-0">
            {/* Logo */}
            <Link
              to="/"
              className="font-mono font-bold text-xl text-white tracking-tight flex items-center gap-1.5"
            >
              <span className="inline-block w-3.5 h-3.5 rounded-sm bg-primary" aria-hidden="true" />
              Jobbify
            </Link>

            {/* Divider */}
            <span className="hidden md:block w-px h-5 bg-white/20" />

            {/* Nav links */}
            <ul className="hidden md:flex items-center gap-1">
              <li>
                <Link
                  to="/browseJobs"
                  className="px-3 py-1.5 rounded text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Browse Jobs
                </Link>
              </li>

              {user && (
                <>
                  <li>
                    <Link
                      to="/community"
                      className="px-3 py-1.5 rounded text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      Community
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/job-basic-details"
                      className="px-3 py-1.5 rounded text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      Post a Job
                    </Link>
                  </li>
                  
                  {user.role === "USER" && (
                    <>
                      <li>
                        <Link to="/my-posts" className="px-3 py-1.5 rounded text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                            Track Post
                        </Link>
                      </li>
                      <li>
                        <Link to="/track-applications" className="px-3 py-1.5 rounded text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                            Applications
                        </Link>
                      </li>
                    </>
                    
                  )}
                  {user.role === "LEAD" && (
                     <>
                        <li>
                            <Link to="/lead-approval" className="px-3 py-1.5 rounded text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                                Lead Approval
                            </Link>
                        </li>
                        <li>
                            <Link to="/lead/approved-by-me" className="px-3 py-1.5 rounded text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                                Approved List
                            </Link>
                        </li>
                     </>
                  )}
                  
                </>
              )}
            </ul>
          </div>

          {/* RIGHT — Search + icon actions + avatar */}
          <div className="flex items-center gap-2 shrink-0">

            {/* Become a Lead */}
              
              { user && user.role === "USER" && user.isEmailVerified && (
                <>
                  <Link
                    to="/become-a-lead"
                    className="px-3 py-1.5 rounded text-sm bg-yellow-200/20 backdrop-blur-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    Become a Lead
                  </Link>
                </>
              )}

              {user && user?.role === "ADMIN" && (
                    <>
                      <li>
                        <Link to="/admin" className="px-3 py-1.5 rounded text-sm text-gray-300 hover:text-gray-300 hover:bg-white/10 transition-colors">
                          Admin
                        </Link>
                      </li>
                      <li>
                        <Link to="/admin/lead-requests" className="px-3 py-1.5 rounded text-sm text-gray-300 hover:text-gray-300 hover:bg-white/10 transition-colors">
                          Lead requests
                        </Link>
                      </li>

                      <li>
                        <Link to="/company" className="px-3 py-1.5 rounded text-sm text-gray-300 hover:text-gray-300 hover:bg-white/10 transition-colors">
                          Company List
                        </Link>
                      </li>
                    </>
                  )}

                  {user && user?.role === "LEAD" && (
                      <>
                        <li>
                          <Link to="/lead/posted" className="px-3 py-1.5 rounded text-sm text-gray-300 hover:text-gray-300 hover:bg-white/10 transition-colors">
                            Applications
                          </Link>
                      </li>
                    </>
                  )}

            
            {/* Divider */}
            <span className="hidden sm:block w-px h-5 bg-white/20 mx-1" />

            
            {/* User section */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded hover:bg-white/10 transition-colors group">
                    {/* Avatar circle */}
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#39C16C]/20 border border-[#39C16C]/50 text-[#39C16C] text-xs font-bold select-none">
                      {initial}
                    </span>
                    {/* Chevron */}
                    <svg
                      className="size-3.5 text-gray-400 group-hover:text-white transition-colors"
                      viewBox="0 0 12 12" fill="none"
                    >
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-44 bg-[#1C2433] border border-white/10 text-gray-200 shadow-xl"
                >
                  <div className="px-3 py-2 border-b border-white/10">
                    <p className="text-xs text-gray-400 truncate">{user.name ?? "User"}</p>
                  </div>

                  <DropdownMenuItem asChild>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 cursor-pointer text-sm hover:text-white hover:bg-white/10 px-3 py-2"
                    >
                      <UserIcon className="size-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-white/10" />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 cursor-pointer text-sm text-red-400 hover:text-red-300 hover:bg-white/10 px-3 py-2"
                  >
                    <LogOutIcon className="size-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth/login"
                  className="text-sm text-gray-300 hover:text-white px-3 py-1.5 rounded hover:bg-white/10 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/auth/register"
                  className="text-sm text-white bg-primary hover:bg-primary/20 px-3 py-1.5 rounded font-medium transition-colors flex items-center gap-1.5"
                >
                  Get started
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar