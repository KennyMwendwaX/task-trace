"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { LuHome, LuLineChart, LuUsers, LuChevronLeft } from "react-icons/lu";
import { RxDashboard } from "react-icons/rx";
import { GoTasklist } from "react-icons/go";
import { HiOutlineCog } from "react-icons/hi";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  links: {
    href: string;
    title: string;
    icon?: JSX.Element;
    isDashboard?: boolean;
  }[];
}

export function SideNav({ className, links, ...props }: SidebarNavProps) {
  const pathname = usePathname();
  const mainLinks = links.filter((link) => !link.isDashboard);
  const dashboardLink = links.find((link) => link.isDashboard);

  return (
    <nav className={cn("flex flex-col", className)} {...props}>
      {/* Dashboard Link */}
      {dashboardLink && (
        <div className="px-3 mb-6">
          <Link
            href={dashboardLink.href}
            className={cn(
              "flex items-center group w-full rounded-md px-3 py-2.5",
              "text-muted-foreground hover:text-primary hover:bg-muted/50",
              "transition-all duration-200 ease-out"
            )}>
            <span className="flex items-center gap-2">
              <LuChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
              {dashboardLink.icon}
            </span>
            <span className="font-medium text-sm ml-1">
              {dashboardLink.title}
            </span>
          </Link>
        </div>
      )}

      {/* Main Navigation */}
      <div className="px-3 space-y-1.5">
        {mainLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              pathname === link.href
                ? "bg-muted hover:bg-muted text-primary font-medium"
                : "hover:bg-muted/50 hover:text-primary text-muted-foreground",
              "w-full justify-start gap-3",
              "h-11 px-3 py-2.5",
              "transition-all duration-200 ease-out"
            )}>
            {link.icon}
            <span className="text-sm">{link.title}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default function Sidebar() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;

  const links = [
    {
      href: `/dashboard`,
      title: "Back to Dashboard",
      isDashboard: true,
    },
    {
      href: `/projects/${projectId}`,
      title: "Overview",
      icon: <RxDashboard className="h-4 w-4" />,
    },
    {
      href: `/projects/${projectId}/tasks`,
      title: "Tasks",
      icon: <GoTasklist className="h-5 w-5" />,
    },
    {
      href: `/projects/${projectId}/members`,
      title: "Members",
      icon: <LuUsers className="h-4 w-4" />,
    },
    {
      href: `/projects/${projectId}/analytics`,
      title: "Analytics",
      icon: <LuLineChart className="h-4 w-4" />,
    },
    {
      href: `/projects/${projectId}/settings`,
      title: "Settings",
      icon: <HiOutlineCog className="h-4 w-4" />,
    },
  ];

  return (
    <div className="fixed top-0 left-0 w-[260px] h-full border-r bg-muted/40 hidden lg:block">
      <div className="flex h-full max-h-screen flex-col">
        <div className="flex-1 mt-[72px]">
          <SideNav links={links} />
        </div>
      </div>
    </div>
  );
}
