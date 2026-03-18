import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSession } from "@/hooks/queries/auth";
import { cn } from "@/lib/utils";
import {
  BriefcaseBusiness,
  Building2,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Files,
  FolderCheck,
  Menu,
  Newspaper,
  ShieldCheck,
  SquareChartGantt,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

type Role = "USER" | "ADMIN" | "LEAD";

type NavItem = {
  to: string;
  label: string;
  icon: typeof BriefcaseBusiness;
  roles?: Role[];
};

const navItems: NavItem[] = [
  { to: "/postjob", label: "Post Job", icon: BriefcaseBusiness, roles: ["USER", "ADMIN", "LEAD"] },
  { to: "/community", label: "Community", icon: Users, roles: ["USER", "ADMIN", "LEAD"] },
  { to: "/profile", label: "Profile", icon: CircleUserRound, roles: ["USER"] },
  { to: "/my-posts", label: "Track My Posts", icon: Files, roles: ["USER"] },
  { to: "/newrequest", label: "Job Requests", icon: Newspaper, roles: ["ADMIN"] },
  { to: "/approved", label: "Approved Jobs", icon: ShieldCheck, roles: ["ADMIN"] },
  { to: "/company", label: "Company List", icon: Building2, roles: ["ADMIN"] },
  { to: "/lead-approval", label: "Pending Job Requests", icon: SquareChartGantt, roles: ["LEAD"] },
  { to: "/lead/approved-by-me", label: "Approved by Me", icon: FolderCheck, roles: ["LEAD"] },
  { to: "/joblistings", label: "Browse Jobs", icon: BriefcaseBusiness },
];

const linkBaseClassName =
  "flex w-full items-center gap-3 rounded-none border-b border-border text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground";

const RoleNavbar = () => {
  const { data: user } = useSession();
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(false);

  const role = user?.role as Role | undefined;
  const visibleItems = navItems.filter((item) => !item.roles || (role ? item.roles.includes(role) : false));

  const renderLink = (item: NavItem, collapsed = false, closeOnClick = false) => {
    const Icon = item.icon;

    const content = (
      <Link
        key={item.to}
        to={item.to}
        title={collapsed ? item.label : undefined}
        className={cn(
          linkBaseClassName,
          collapsed ? "justify-center px-0 h-12" : "h-12 px-4"
        )}
      >
        <Icon className="size-4 shrink-0" />
        <span
          className={cn(
            "whitespace-nowrap transition-opacity",
            collapsed && "pointer-events-none w-0 overflow-hidden opacity-0"
          )}
        >
          {item.label}
        </span>
      </Link>
    );

    if (!closeOnClick) {
      return <li key={item.to}>{content}</li>;
    }

    return (
      <li key={item.to}>
        <SheetClose asChild>{content}</SheetClose>
      </li>
    );
  };

  return (
    <>
      <div className="fixed top-12 left-0 right-0 z-40 border-b border-border bg-background/95 backdrop-blur md:hidden">
        <div className="flex h-14 items-center justify-between px-3">
          <span className="text-sm font-semibold text-foreground">Options</span>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="cursor-pointer">
                <Menu className="size-5" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-[18rem] p-0" showCloseButton>
              <SheetHeader className="border-b border-border">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>

              <nav className="overflow-y-auto">
                <ul className="flex flex-col">{visibleItems.map((item) => renderLink(item, false, true))}</ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <aside
        className={cn(
          "hidden shrink-0 border-r border-border bg-background/80 backdrop-blur-sm transition-[width] duration-200 md:sticky md:top-12 md:flex md:h-[calc(100vh-3rem)] md:flex-col",
          isDesktopExpanded ? "md:w-48" : "md:w-16"
        )}
      >
        <div className="flex h-12 items-center justify-end border-b border-border px-4">
          <Button
            variant="ghost"
            size="icon-sm"
            className="cursor-pointer"
            onClick={() => setIsDesktopExpanded((current) => !current)}
          >
            {isDesktopExpanded ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
            <span className="sr-only">
              {isDesktopExpanded ? "Collapse navigation" : "Expand navigation"}
            </span>
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="flex flex-col">{visibleItems.map((item) => renderLink(item, !isDesktopExpanded))}</ul>
        </nav>
      </aside>
    </>
  );
};

export default RoleNavbar;