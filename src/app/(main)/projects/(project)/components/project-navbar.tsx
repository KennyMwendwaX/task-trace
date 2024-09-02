"use client";

import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PersonIcon } from "@radix-ui/react-icons";
import Logo from "@/app/logo.png";
import { IoSettingsOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LuHome, LuLineChart, LuMenu, LuUsers } from "react-icons/lu";
import { RxDashboard } from "react-icons/rx";
import { GoTasklist } from "react-icons/go";
import { HiOutlineCog } from "react-icons/hi";

export default function ProjectNavbar() {
  return (
    <>
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-muted px-4 md:px-6 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 lg:hidden">
              <LuMenu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <Link
              href="/"
              className="flex items-center gap-1 font-semibold whitespace-nowrap">
              <Image src={Logo} width={32} height={28} alt="" />
              <span className="text-lg tracking-tighter">TaskTrace</span>
              <span className="sr-only">Logo</span>
            </Link>
            <SmSidebar />
          </SheetContent>
        </Sheet>
        <Link
          href="#"
          className="flex items-center gap-1 font-semibold whitespace-nowrap">
          <Image src={Logo} width={32} height={28} alt="" />
          <span className="text-lg tracking-tighter">TaskTrace</span>
          <span className="sr-only">Logo</span>
        </Link>

        <div className="items-center ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 border border-gray-600 cursor-pointer">
                <AvatarImage src={""} alt="profile-image" />
                <AvatarFallback className="bg-white">
                  <PersonIcon className="h-5 w-5 text-gray-600" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 z-50" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-base font-medium leading-none">
                    Kennedy Mwendwa
                  </p>
                  <p className="text-xs leading-none text-gray-500">
                    kennymwendwa67@gmail.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center">
                <IoSettingsOutline className="mr-2 w-5 h-5" /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center hover:bg-red-100">
                <MdLogout className="mr-2 w-5 h-5" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  links: {
    href: string;
    title: string;
    icon: JSX.Element;
  }[];
}

export function SideNav({ className, links, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("grid gap-2 text-xl font-medium")} {...props}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === link.href
              ? "bg-muted hover:bg-muted text-primary"
              : "hover:bg-muted hover:text-primary text-muted-foreground",
            "flex items-center justify-start gap-3 rounded-lg px-4 py-2.5 transition-all"
          )}>
          {link.icon}
          {link.title}
        </Link>
      ))}
    </nav>
  );
}

export function SmSidebar() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;

  const links = [
    {
      href: `/dashboard`,
      title: "Dashboard",
      icon: <LuHome className="h-5 w-5" />,
    },
    {
      href: `/projects/${projectId}`,
      title: "Overview",
      icon: <RxDashboard className="h-5 w-5" />,
    },
    {
      href: `/projects/${projectId}/tasks`,
      title: "Tasks",
      icon: <GoTasklist className="h-6 w-6" />,
    },
    {
      href: `/projects/${projectId}/members`,
      title: "Members",
      icon: <LuUsers className="h-5 w-5" />,
    },
    {
      href: `/projects/${projectId}/analytics`,
      title: "Analytics",
      icon: <LuLineChart className="h-5 w-5" />,
    },
    {
      href: `/projects/${projectId}/settings`,
      title: "Settings",
      icon: <HiOutlineCog className="h-6 w-6" />,
    },
  ];

  return (
    <>
      {/* Arrow Home */}
      <SideNav links={links} />
    </>
  );
}
