import * as React from "react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Link } from "react-router"
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
    href: "/newrequest",
    description: "Review incoming job requests.",
    roles: ["ADMIN"],
  },
  {
    title: "Jobs Approved",
    href: "/approved",
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

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent font-normal text-base px-0 hover:bg-transparent focus:bg-transparent data-active:bg-transparent data-[state=open]:bg-transparent">
            Jobs
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-85 gap-2 p-3 md:w-105 md:grid-cols-2">
              {visibleItems.map((item) => (
                <ListItem key={item.title} title={item.title} href={item.href}>
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
          className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="size-3.5 text-muted-foreground" />
            <span className="text-sm font-medium leading-none">{title}</span>
          </div>
          <p className="line-clamp-2 text-xs text-muted-foreground">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}