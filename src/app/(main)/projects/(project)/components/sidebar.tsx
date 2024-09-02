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
    icon: JSX.Element;
    isDashboard?: boolean;
  }[];
}

export function SideNav({ className, links, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 px-1",
        className
      )}
      {...props}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === link.href
              ? "bg-muted hover:bg-muted text-primary"
              : "hover:bg-muted hover:text-primary text-muted-foreground",
            "flex items-center justify-start gap-3 rounded-lg px-6 py-2.5 transition-all",
            link.isDashboard &&
              "bg-primary/10 text-primary hover:bg-primary/20 mb-2"
          )}>
          {link.isDashboard && <LuChevronLeft className="h-4 w-4 mr-1" />}
          {link.icon}
          {link.title}
        </Link>
      ))}
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
      icon: <LuHome className="h-4 w-4" />,
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
      icon: <HiOutlineCog className="h-5 w-5" />,
    },
  ];

  return (
    <div className="fixed top-0 left-0 w-[260px] h-full border-r bg-muted/40 hidden lg:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex-1 mt-[72px]">
          <SideNav links={links} />
        </div>
      </div>
    </div>
  );
}
