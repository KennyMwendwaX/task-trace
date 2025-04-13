"use client";

import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { User } from "lucide-react";
import { MdLogout } from "react-icons/md";
import { LuMenu } from "react-icons/lu";
import Logo from "@/app/logo.png";
import { IoSettingsOutline } from "react-icons/io5";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "@/lib/auth-client";

export default function Navbar() {
  const pathname = usePathname();
  const { data: sessionData } = useSession();
  const router = useRouter();
  const userInfo = sessionData?.user;
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6 z-50">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <LuMenu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="flex flex-col gap-4">
            <Link className="flex items-center gap-1" href="/dashboard">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Image src={Logo} width={32} height={28} alt="" />
              </div>
              <div className="flex-1 text-left text-base leading-tight">
                <span className="truncate font-semibold">TaskTrace</span>
              </div>
            </Link>
            <SmSidebar />
          </nav>
        </SheetContent>
      </Sheet>
      <Link className="flex items-center gap-1" href="/dashboard">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Image src={Logo} width={32} height={28} alt="" />
        </div>
        <div className="flex-1 text-left text-base leading-tight">
          <span className="truncate font-semibold">TaskTrace</span>
        </div>
      </Link>
      <nav className="hidden flex-1 justify-center flex-col gap-6 text-base font-medium lg:flex lg:flex-row lg:items-center lg:gap-6">
        <Link
          href="/dashboard"
          className={`${
            pathname === "/dashboard"
              ? "text-foreground"
              : "text-muted-foreground"
          } transition-colors hover:text-foreground`}>
          Dashboard
        </Link>
        <Link
          href="/projects"
          className={`${
            pathname === "/projects"
              ? "text-foreground"
              : "text-muted-foreground"
          } transition-colors hover:text-foreground`}>
          Projects
        </Link>
        <Link
          href="/explore"
          className={`${
            pathname === "/explore"
              ? "text-foreground"
              : "text-muted-foreground"
          } transition-colors hover:text-foreground`}>
          Explore
        </Link>
        <Link
          href="/tasks"
          className={`${
            pathname === "/tasks" ? "text-foreground" : "text-muted-foreground"
          } transition-colors hover:text-foreground`}>
          Tasks
        </Link>
        <Link
          href="/settings"
          className={`${
            pathname === "/settings"
              ? "text-foreground"
              : "text-muted-foreground"
          } transition-colors hover:text-foreground`}>
          Settings
        </Link>
      </nav>

      <div className="items-center ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-8 w-8 border border-gray-600 cursor-pointer">
              <AvatarImage src={userInfo?.image || ""} alt="profile-image" />
              <AvatarFallback className="bg-white">
                <User className="h-5 w-5 text-gray-600" />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-base font-medium leading-none">
                  {userInfo?.name}
                </p>
                <p className="text-xs leading-none text-gray-500">
                  {userInfo?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center">
              <IoSettingsOutline className="mr-2 w-5 h-5" /> Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.replace("/sign-in");
                    },
                  },
                });
              }}
              className="flex items-center hover:bg-red-100">
              <MdLogout className="mr-2 w-5 h-5" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  links: {
    href: string;
    title: string;
  }[];
}

export function SideNav({ className, links, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("grid gap-2 text-xl font-medium mt-2")} {...props}>
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
          {link.title}
        </Link>
      ))}
    </nav>
  );
}

export function SmSidebar() {
  const links = [
    {
      href: "/dashboard",
      title: "Dashboard",
    },
    {
      href: "/projects",
      title: "Projects",
    },
    {
      href: "/explore",
      title: "Explore",
    },
    {
      href: "/tasks",
      title: "Tasks",
    },
    {
      href: "/settings",
      title: "Settings",
    },
  ];

  return <SideNav links={links} />;
}
