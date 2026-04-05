import { useLogout, useSession } from "@/hooks/queries/auth"
import { Link, useNavigate } from "react-router"
import { ArrowRight, LogOutIcon, Menu, UserIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Button } from "../ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet"

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
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border bg-[#f9fbfd]">
      <div className="h-full max-w-screen-2xl mx-auto px-4 flex items-center justify-between gap-4">

        <div className="flex items-center gap-3 lg:hidden">
          <Link
            to="/"
            className="font-mono font-bold text-xl text-foreground tracking-tight flex items-center gap-1.5"
          >
            <span className="inline-block w-3.5 h-3.5 rounded-sm bg-[#E68844]" aria-hidden="true" />
            Vettd
          </Link>
        </div>

        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-md">
                <Menu className="size-5" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="top" className="max-h-[85vh] overflow-y-auto p-0">
              <SheetHeader className="border-b border-border px-4 py-3 text-left">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>

              <nav className="px-2 py-2">
                <ul className="flex flex-col list-none">
                  <li>
                    <SheetClose asChild>
                      <Link to="/browseJobs" className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent">
                        Browse Jobs
                      </Link>
                    </SheetClose>
                  </li>

                  {user && (
                    <>
                      <li>
                        <SheetClose asChild>
                          <Link to="/community" className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent">
                            Community
                          </Link>
                        </SheetClose>
                      </li>
                      <li>
                        <SheetClose asChild>
                          <Link to="/job-basic-details" className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent">
                            Post a Job
                          </Link>
                        </SheetClose>
                      </li>

                      {user.role === "USER" && (
                        <>
                          <li>
                            <SheetClose asChild>
                              <Link to="/my-posts" className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent">
                                Track Post
                              </Link>
                            </SheetClose>
                          </li>
                          <li>
                            <SheetClose asChild>
                              <Link to="/track-applications" className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent">
                                Applications
                              </Link>
                            </SheetClose>
                          </li>
                        </>
                      )}

                      {user.role === "LEAD" && (
                        <>
                          <li>
                            <SheetClose asChild>
                              <Link to="/lead-approval" className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent">
                                Lead Approval
                              </Link>
                            </SheetClose>
                          </li>
                          <li>
                            <SheetClose asChild>
                              <Link to="/lead/approved-by-me" className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent">
                                Approved List
                              </Link>
                            </SheetClose>
                          </li>
                        </>
                      )}

                      {user.role === "USER" && user.isEmailVerified && (
                        <li>
                          <SheetClose asChild>
                            <Link to="/become-a-lead" className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent">
                              Become a Lead
                            </Link>
                          </SheetClose>
                        </li>
                      )}

                      {user?.role === "ADMIN" && (
                        <>
                          <li>
                            <SheetClose asChild>
                              <Link to="/admin" className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent">
                                Admin
                              </Link>
                            </SheetClose>
                          </li>
                          <li>
                            <SheetClose asChild>
                              <Link to="/admin/lead-requests" className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent">
                                Lead requests
                              </Link>
                            </SheetClose>
                          </li>
                          <li>
                            <SheetClose asChild>
                              <Link to="/company" className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent">
                                Company List
                              </Link>
                            </SheetClose>
                          </li>
                        </>
                      )}

                      {user?.role === "LEAD" && (
                        <li>
                          <SheetClose asChild>
                            <Link to="/lead/posted" className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent">
                              Applications
                            </Link>
                          </SheetClose>
                        </li>
                      )}

                      <li>
                        <SheetClose asChild>
                          <Link to="/profile" className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent">
                            Profile
                          </Link>
                        </SheetClose>
                      </li>
                      <li>
                        <SheetClose asChild>
                          <button
                            onClick={handleLogout}
                            className="block w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                          >
                            Logout
                          </button>
                        </SheetClose>
                      </li>
                    </>
                  )}

                  {!user && (
                    <>
                      <li>
                        <SheetClose asChild>
                          <Link to="/auth/login" className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent">
                            Sign in
                          </Link>
                        </SheetClose>
                      </li>
                      <li>
                        <SheetClose asChild>
                          <Link to="/auth/register" className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent">
                            Get started
                            <ArrowRight className="size-3.5" />
                          </Link>
                        </SheetClose>
                      </li>
                    </>
                  )}
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

          {/* LEFT — Logo + Nav links */}
          <div className="hidden lg:flex items-center gap-6 shrink-0">
            {/* Logo */}
            <Link
              to="/"
              className="font-mono font-bold text-xl text-foreground tracking-tight flex items-center gap-1.5"
            >
              <span className="inline-block w-3.5 h-3.5 rounded-sm bg-[#E68844]" aria-hidden="true" />
              Vettd
            </Link>

            {/* Divider */}
            <span className="w-px h-5 bg-border" />

            {/* Nav links */}
            <ul className="flex items-center gap-1 list-none">
              <li>
                <Link
                  to="/browseJobs"
                  className="px-3 py-1.5 rounded text-sm text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
                >
                  Browse Jobs
                </Link>
              </li>

              {user && (
                <>
                  <li>
                    <Link
                      to="/community"
                      className="px-3 py-1.5 rounded text-sm text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
                    >
                      Community
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/job-basic-details"
                      className="px-3 py-1.5 rounded text-sm text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
                    >
                      Post a Job
                    </Link>
                  </li>
                  
                  {user.role === "USER" && (
                    <>
                      <li>
                        <Link to="/my-posts" className="px-3 py-1.5 rounded text-sm text-foreground/80 hover:text-foreground hover:bg-accent transition-colors">
                            Track Post
                        </Link>
                      </li>
                      <li>
                        <Link to="/track-applications" className="px-3 py-1.5 rounded text-sm text-foreground/80 hover:text-foreground hover:bg-accent transition-colors">
                            Applications
                        </Link>
                      </li>
                    </>
                    
                  )}
                  {user.role === "LEAD" && (
                     <>
                        <li>
                        <Link to="/lead-approval" className="px-3 py-1.5 rounded text-sm text-foreground/80 hover:text-foreground hover:bg-accent transition-colors">
                                Lead Approval
                            </Link>
                        </li>
                        <li>
                        <Link to="/lead/approved-by-me" className="px-3 py-1.5 rounded text-sm text-foreground/80 hover:text-foreground hover:bg-accent transition-colors">
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
          <div className="hidden lg:flex items-center gap-2 shrink-0">

            {/* Become a Lead */}
              
              { user && user.role === "USER" && user.isEmailVerified && (
                <>
                  <Link
                    to="/become-a-lead"
                    className="px-3 py-1.5 rounded text-sm bg-[#474b3a] text-[#f8f8f2] hover:opacity-90 transition-opacity"
                  >
                    Become a Lead
                  </Link>
                </>
              )}

              {user && user?.role === "ADMIN" && (
                    <>
                      <div>
                        <Link to="/admin" className="px-3 py-1.5 rounded text-sm text-foreground/80 hover:text-foreground hover:bg-accent transition-colors">
                          Admin
                        </Link>
                      </div>
                      <div>
                        <Link to="/admin/lead-requests" className="px-3 py-1.5 rounded text-sm text-foreground/80 hover:text-foreground hover:bg-accent transition-colors">
                          Lead requests
                        </Link>
                      </div>

                      <div>
                        <Link to="/company" className="px-3 py-1.5 rounded text-sm text-foreground/80 hover:text-foreground hover:bg-accent transition-colors">
                          Company List
                        </Link>
                      </div>
                    </>
                  )}

                  {user && user?.role === "LEAD" && (
                      <>
                        <div>
                          <Link to="/lead/posted" className="px-3 py-1.5 rounded text-sm text-foreground/80 hover:text-foreground hover:bg-accent transition-colors">
                            Applications
                          </Link>
                      </div>
                    </>
                  )}

            
            {/* Divider */}
            <span className="w-px h-5 bg-border mx-1" />

            
            {/* User section */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded hover:bg-accent transition-colors group">
                    {/* Avatar circle */}
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d9f8e8] border border-[#3ba66b] text-[#16784a] text-xs font-bold select-none">
                      {initial}
                    </span>
                    {/* Chevron */}
                    <svg
                      className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors"
                      viewBox="0 0 12 12" fill="none"
                    >
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-44 bg-background border border-border text-foreground shadow-xl"
                >
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-xs text-muted-foreground truncate">{user.name ?? "User"}</p>
                  </div>

                  <DropdownMenuItem asChild>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 cursor-pointer text-sm hover:text-foreground hover:bg-accent px-3 py-2"
                    >
                      <UserIcon className="size-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-border" />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 cursor-pointer text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2"
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
                  className="text-sm text-foreground/80 hover:text-foreground px-3 py-1.5 rounded hover:bg-accent transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/auth/register"
                  className="text-sm text-white bg-primary hover:opacity-90 px-3 py-1.5 rounded font-medium transition-opacity flex items-center gap-1.5"
                >
                  Get started
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            )}
          </div>
      </div>
    </nav>
  )
}

export default Navbar