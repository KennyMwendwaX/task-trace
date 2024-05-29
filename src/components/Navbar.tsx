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
import { Button } from "@/components/ui/button";
import { PersonIcon } from "@radix-ui/react-icons";
import { MdLogout } from "react-icons/md";
import { logout } from "@/actions/auth/logout";
import { Session } from "next-auth";
import { LuMenu } from "react-icons/lu";
import Logo from "../../public/logo.png";
import { IoSettingsOutline } from "react-icons/io5";
import { usePathname } from "next/navigation";

type Props = {
  session: Session | null;
};

export default function Navbar({ session }: Props) {
  const pathname = usePathname();
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
          <Link
            href="/"
            className="flex items-center gap-1 font-semibold whitespace-nowrap">
            <Image src={Logo} width={32} height={28} alt="" />
            <span className="text-lg tracking-tighter">TaskTrace</span>
            <span className="sr-only">Logo</span>
          </Link>
          <nav className="grid gap-6 text-lg font-medium">
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
              href="/tasks"
              className={`${
                pathname === "/tasks"
                  ? "text-foreground"
                  : "text-muted-foreground"
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
        </SheetContent>
      </Sheet>
      <Link
        href="#"
        className="flex items-center gap-1 font-semibold whitespace-nowrap">
        <Image src={Logo} width={32} height={28} alt="" />
        <span className="text-lg tracking-tighter">TaskTrace</span>
        <span className="sr-only">Logo</span>
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
              <AvatarImage src={""} alt="profile-image" />
              <AvatarFallback className="bg-white">
                <PersonIcon className="h-5 w-5 text-gray-600" />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
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
            <DropdownMenuItem
              onClick={() => {}}
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
