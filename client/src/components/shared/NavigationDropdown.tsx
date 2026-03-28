import * as React from "react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Link, useLocation } from "react-router"
import { Briefcase } from "lucide-react"

export type Role = "USER" | "ADMIN" | "LEAD"

export type TopNavMenuItem = {
  title: string
  href: string
  description: string
  roles?: Role[]
}

const jobItems: TopNavMenuItem[] = [
  {
    title: "Track My Posts",
    href: "/my-posts",
    description: "Review the jobs you submitted.",
    roles: ["USER"],
  },
  {
    title: "Job Requests",
    href: "/admin/requests",
    description: "Review incoming job requests.",
    roles: ["ADMIN"],
  },
  {
    title: "Jobs Approved",
    href: "/admin/reviewed",
    description: "See jobs approved by admins.",
    roles: ["ADMIN"],
  },
  {
    title: "Company Listings",
    href: "/company",
    description: "View all registered companies.",
    roles: ["ADMIN"],
  },
  {
    title: "Pending Job Requests",
    href: "/lead-approval",
    description: "Review pending requests as lead.",
    roles: ["LEAD"],
  },
  {
    title: "Approved by Me",
    href: "/lead/approved-by-me",
    description: "See jobs approved by you.",
    roles: ["LEAD"],
  },
]

export function getTopNavJobItems(role?: Role): TopNavMenuItem[] {
  if (!role) {
    return jobItems.filter((item) => item.title === "Browse Jobs")
  }
  return jobItems.filter((item) => !item.roles || item.roles.includes(role))
}

export function NavigationDropdown({ role }: { role?: Role }) {
  const visibleItems = getTopNavJobItems(role)
  const [value, setValue] = React.useState("")
  const location = useLocation()

  React.useEffect(() => {
    setValue("")
  }, [location.pathname])

  return (
    <NavigationMenu value={value} onValueChange={setValue}>
      <NavigationMenuList>
        <NavigationMenuItem value="jobs">
          <NavigationMenuTrigger className="h-auto bg-transparent! hover:bg-transparent! focus:bg-transparent! focus-visible:bg-transparent! data-[state=open]:bg-transparent! active:bg-transparent! px-3 py-1.5 text-sm font-normal text-gray-300 rounded hover:text-white data-[state=open]:text-white [&>svg]:text-gray-400 [&>svg]:ml-1">
            Jobs
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-80 gap-1 p-3 md:w-96 md:grid-cols-2">
              {visibleItems.map((item) => (
                <ListItem key={item.title} title={item.title} href={item.href} className="hover:bg-slate-100">
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link
          to={href}
          className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10 focus:bg-white/10"
        >
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="size-3.5 " />
            <span className="text-sm font-medium leading-none">{title}</span>
          </div>
          <p className="line-clamp-2 text-xs text-gray-500">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}