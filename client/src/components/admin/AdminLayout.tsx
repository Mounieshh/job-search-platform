import { Link, NavLink, useNavigate } from "react-router"
import { useSession } from "@/hooks/queries/auth"
import { useLogout } from "@/hooks/queries/auth"
import { useUserProfile } from "@/hooks/queries/profile"
import { useAdminLeadRequests } from "@/hooks/queries/admin"
import {
  LayoutDashboard,
  Inbox,
  CheckSquare,
  Users,
  MessageSquare,
  History,
  LogOut,
  Building2,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/lead-requests", label: "Lead requests", icon: Inbox, badge: true },
  { to: "/admin/requests", label: "Job queue", icon: Inbox, badge: false },
  { to: "/admin/reviewed", label: "Reviewed jobs", icon: CheckSquare, badge: false },
  { to: "/admin/community", label: "Community", icon: MessageSquare, badge: false },
  { to: "/admin/credential-history", label: "Credential history", icon: History, badge: false },
  { to: "/company", label: "Companies", icon: Building2, badge: false },
]

function SidebarContent({ pendingLeadCount, onClose }: { pendingLeadCount: number; onClose?: () => void }) {
  const { data: user } = useSession()
  const { data: profileData } = useUserProfile()
  const { mutateAsync: logout } = useLogout()
  const navigate = useNavigate()
  const avatarUrl = profileData?.profile?.avatarUrl
  const initial = user?.name?.trim()?.charAt(0)?.toUpperCase() ?? "A"

  const handleLogout = async () => {
    await logout()
    navigate("/auth/login")
  }

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-5">
        <Link
          to="/admin"
          onClick={onClose}
          className="font-display font-extrabold text-lg text-foreground tracking-tight flex items-center gap-2"
        >
          <span className="inline-block w-3 h-3 rounded-sm bg-primary" aria-hidden="true" />
          Vettd
          <span className="text-xs font-medium text-muted-foreground tracking-widest uppercase ml-1">Admin</span>
        </Link>
        {onClose && (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav aria-label="Admin navigation" className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Navigation
        </p>
        <ul className="space-y-0.5" role="list">
          {navItems.map(({ to, label, icon: Icon, exact, badge }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={exact}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150 ${
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground/70 hover:bg-accent hover:text-foreground"
                  }`
                }
              >
                <span className="flex items-center gap-3">
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  {label}
                </span>
                {badge && pendingLeadCount > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
                    {pendingLeadCount}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mt-6 border-t border-border pt-4">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            App
          </p>
          <NavLink
            to="/community"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground/70 hover:bg-accent hover:text-foreground transition-colors duration-150"
          >
            <Users className="size-4 shrink-0" aria-hidden="true" />
            Back to app
          </NavLink>
        </div>
      </nav>

      {/* User footer */}
      <div className="shrink-0 border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-md px-2 py-2">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`Profile photo of ${user?.name}`}
              className="h-8 w-8 rounded-full border border-border object-cover shrink-0"
            />
          ) : (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold select-none border border-primary/20">
              {initial}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground leading-tight">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <button
            type="button"
            aria-label="Log out"
            onClick={handleLogout}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors duration-150"
          >
            <LogOut className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: leadRequests } = useAdminLeadRequests()
  const pendingLeadCount = leadRequests?.length ?? 0
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside
        aria-label="Admin sidebar"
        className="hidden w-56 shrink-0 border-r border-border bg-sidebar lg:flex lg:flex-col"
      >
        <SidebarContent pendingLeadCount={pendingLeadCount} />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        aria-label="Admin navigation"
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-sidebar transition-transform duration-200 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent pendingLeadCount={pendingLeadCount} onClose={() => setMobileOpen(false)} />
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile topbar */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4 lg:hidden">
          <button
            type="button"
            aria-label="Open navigation menu"
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground hover:bg-accent"
          >
            <Menu className="size-4" aria-hidden="true" />
          </button>
          <Link
            to="/admin"
            className="font-display font-extrabold text-lg text-foreground tracking-tight flex items-center gap-2"
          >
            <span className="inline-block w-3 h-3 rounded-sm bg-primary" aria-hidden="true" />
            Vettd Admin
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
