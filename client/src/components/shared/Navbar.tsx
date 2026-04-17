import { useLogout, useSession } from "@/hooks/queries/auth"
import { useUserProfile } from "@/hooks/queries/profile"
import { Link, useNavigate } from "react-router"
import { AppWindowIcon, ArrowRight, LogOutIcon, Menu, UserIcon } from "lucide-react"
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
import NotificationBell from "./NotificationBell"

const navLinkClass = "block rounded-md px-3 py-3 text-sm text-foreground hover:bg-accent transition-colors duration-150"
const desktopLinkClass = "px-3 py-1.5 rounded text-sm text-foreground/80 hover:text-foreground hover:bg-accent transition-colors duration-150"

const Navbar = () => {
  const { data: user } = useSession()
  const { data: profileData } = useUserProfile()
  const { mutateAsync: logout } = useLogout()
  const navigate = useNavigate()
  const initial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U"
  const avatarUrl = profileData?.profile?.avatarUrl

  const handleLogout = async () => {
    await logout()
    navigate("/auth/login")
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border bg-background">
      <div className="h-full max-w-screen-2xl mx-auto px-4 flex items-center justify-between gap-4">

        <div className="flex items-center gap-3 lg:hidden">
          <Link
            to="/"
            className="font-display font-extrabold text-xl text-foreground tracking-tight flex items-center gap-1.5"
          >
            <span className="inline-block w-3.5 h-3.5 rounded-sm bg-primary" aria-hidden="true" />
            Vettd
          </Link>
        </div>

        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-11 w-11 rounded-md">
                <Menu className="size-5" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="top" className="max-h-[85vh] overflow-y-auto p-0">
              <SheetHeader className="border-b border-border px-4 py-3 text-left">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>

              <nav aria-label="Mobile navigation">
                <ul className="flex flex-col list-none px-2 py-2">
                  <li>
                    <SheetClose asChild>
                      <Link to="/browseJobs" className={navLinkClass}>Browse Jobs</Link>
                    </SheetClose>
                  </li>

                  {user && (
                    <>
                      <li>
                        <SheetClose asChild>
                          <Link to="/community" className={navLinkClass}>Community</Link>
                        </SheetClose>
                      </li>
                      <li>
                        <SheetClose asChild>
                          <Link to="/job-basic-details" className={navLinkClass}>Post a Job</Link>
                        </SheetClose>
                      </li>

                      {user.role === "USER" && (
                        <li>
                          <SheetClose asChild>
                            <Link to="/my-posts" className={navLinkClass}>Track Jobs</Link>
                          </SheetClose>
                        </li>
                      )}

                      {user.role === "LEAD" && (
                        <>
                          <li>
                            <SheetClose asChild>
                              <Link to="/lead-approval" className={navLinkClass}>Review Queue</Link>
                            </SheetClose>
                          </li>
                          <li>
                            <SheetClose asChild>
                              <Link to="/lead/approved-by-me" className={navLinkClass}>Reviewed Jobs</Link>
                            </SheetClose>
                          </li>
                        </>
                      )}

                      {user.role === "USER" && user.isEmailVerified && (
                        <li>
                          <SheetClose asChild>
                            <Link to="/become-a-lead" className={navLinkClass}>Become a Lead</Link>
                          </SheetClose>
                        </li>
                      )}

                      {user.role === "ADMIN" && (
                        <>
                          <li>
                            <SheetClose asChild>
                              <Link to="/admin" className={navLinkClass}>Admin</Link>
                            </SheetClose>
                          </li>
                        </>
                      )}

                      {user.role === "LEAD" && (
                        <li>
                          <SheetClose asChild>
                            <Link to="/lead/posted" className={navLinkClass}>Applications</Link>
                          </SheetClose>
                        </li>
                      )}

                      <li>
                        <SheetClose asChild>
                          <Link to="/profile" className={navLinkClass}>Profile</Link>
                        </SheetClose>
                      </li>
                      <li>
                        <SheetClose asChild>
                          <Link to="/notifications" className={navLinkClass}>Notifications</Link>
                        </SheetClose>
                      </li>
                      <li>
                        <SheetClose asChild>
                          <button
                            onClick={handleLogout}
                            className="block w-full rounded-md px-3 py-3 text-left text-sm text-destructive hover:bg-destructive/10 transition-colors duration-150"
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
                          <Link to="/auth/login" className={navLinkClass}>Sign in</Link>
                        </SheetClose>
                      </li>
                      <li>
                        <SheetClose asChild>
                          <Link to="/auth/register" className="flex items-center gap-1.5 rounded-md px-3 py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors duration-150">
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

        <div className="hidden lg:flex items-center gap-6 shrink-0">
          <Link
            to="/"
            className="font-display font-extrabold text-xl text-foreground tracking-tight flex items-center gap-1.5"
          >
            <span className="inline-block w-3.5 h-3.5 rounded-sm bg-primary" aria-hidden="true" />
            Vettd
          </Link>

          <span className="w-px h-5 bg-border" aria-hidden="true" />

          <ul className="flex items-center gap-1 list-none" role="list">
            <li>
              <Link to="/browseJobs" className={desktopLinkClass}>Browse Jobs</Link>
            </li>

            {user && (
              <>
                <li>
                  <Link to="/community" className={desktopLinkClass}>Community</Link>
                </li>
                <li>
                  <Link to="/job-basic-details" className={desktopLinkClass}>Post a Job</Link>
                </li>

                {user.role === "USER" && (
                  <li>
                    <Link to="/my-posts" className={desktopLinkClass}>Track Jobs</Link>
                  </li>
                )}

                {user.role === "LEAD" && (
                  <>
                    <li>
                      <Link to="/lead-approval" className={desktopLinkClass}>Review Queue</Link>
                    </li>
                    <li>
                      <Link to="/lead/approved-by-me" className={desktopLinkClass}>Reviewed Jobs</Link>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
        </div>

        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {user && user.role === "USER" && user.isEmailVerified && (
            <Link
              to="/become-a-lead"
              className="px-3 py-1.5 rounded text-sm bg-foreground text-background hover:opacity-90 transition-opacity duration-150"
            >
              Become a Lead
            </Link>
          )}

          {user && user.role === "ADMIN" && (
            <>
              <Link to="/admin" className={desktopLinkClass}>Admin</Link>
            </>
          )}

          {user && user.role === "LEAD" && (
            <Link to="/lead/posted" className={desktopLinkClass}>Applications</Link>
          )}

          <span className="w-px h-5 bg-border mx-1" aria-hidden="true" />

          {user && <NotificationBell />}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Open user menu"
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded hover:bg-accent transition-colors duration-150 group"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={`${user.name ?? "User"}'s avatar`}
                      className="h-7 w-7 rounded-full border border-secondary object-cover"
                    />
                  ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary/15 border border-secondary text-secondary text-xs font-bold select-none">
                      {initial}
                    </span>
                  )}
                  <svg
                    className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors duration-150"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-44 bg-background border border-border text-foreground shadow-lg"
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

                {user.role === "USER" && (
                  <>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem asChild>
                      <Link
                        to="/track-applications"
                        className="flex items-center gap-2 cursor-pointer text-sm hover:text-foreground hover:bg-accent px-3 py-2"
                      >
                        <AppWindowIcon className="size-4" />
                        Applications
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator className="bg-border" />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 cursor-pointer text-sm text-destructive hover:text-destructive hover:bg-destructive/10 px-3 py-2"
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
                className="text-sm text-foreground/80 hover:text-foreground px-3 py-1.5 rounded hover:bg-accent transition-colors duration-150"
              >
                Sign in
              </Link>
              <Link
                to="/auth/register"
                className="text-sm text-primary-foreground bg-primary hover:opacity-90 px-3 py-1.5 rounded font-medium transition-opacity duration-150 flex items-center gap-1.5"
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
