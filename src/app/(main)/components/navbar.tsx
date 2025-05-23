"use client";

import Link from "next/link";
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
import { PersonIcon } from "@radix-ui/react-icons";
import { MdLogout } from "react-icons/md";
import { LuMenu } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "@/lib/auth-client";
import ThemeToggle from "./theme-toggle";
import Image from "next/image";
import Logo from "@/app/logo.png";
import ThemeLogo from "./theme-logo";

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

export default function Navbar() {
  const pathname = usePathname();
  const session = useSession();
  const router = useRouter();
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50 dark:border-slate-700">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <LuMenu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <Link className="flex items-center gap-1" href="/">
            <ThemeLogo />
            <div className="flex-1 text-left text-base leading-tight">
              <span className="truncate font-semibold">TaskTrace</span>
            </div>
          </Link>
          <SmSidebar />
        </SheetContent>
      </Sheet>
      <Link className="flex items-center gap-1" href="/">
        <ThemeLogo />
        <div className="flex-1 text-left text-base leading-tight">
          <span className="truncate font-semibold text-gray-900 dark:text-white">
            TaskTrace
          </span>
        </div>
      </Link>

      <nav className="hidden flex-1 justify-center flex-col gap-6 text-base font-medium lg:flex lg:flex-row lg:items-center lg:gap-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              pathname === link.href
                ? "text-foreground"
                : "text-muted-foreground",
              "transition-colors hover:text-foreground"
            )}>
            {link.title}
          </Link>
        ))}
      </nav>
      <div className="flex items-center space-x-4 ml-auto">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-8 w-8 border border-gray-300 dark:border-gray-600 cursor-pointer">
              <AvatarImage src={""} alt="profile-image" />
              <AvatarFallback className="bg-muted">
                <PersonIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-base font-medium leading-none">
                  {session.data?.user.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session.data?.user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push("/settings")}
              className="flex items-center">
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
              className="flex items-center hover:bg-red-100 dark:hover:bg-red-900">
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

export function SideNav({ links, ...props }: SidebarNavProps) {
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
  return <SideNav links={links} />;
}
