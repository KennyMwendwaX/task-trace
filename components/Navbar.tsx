"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  CheckCircledIcon,
  MagnifyingGlassIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { LuActivity } from "react-icons/lu";
import { FiCheckCircle } from "react-icons/fi";
import Sidebar from "./Sidebar";
import { MdLogout } from "react-icons/md";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      <nav className="bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-600">
        <div className="flex flex-wrap items-center justify-between mx-auto px-3 py-2">
          <div className="flex items-center space-x-2">
            <Sidebar />
            <div className="flex items-center space-x-8">
              <Link className="flex items-center space-x-1" href="/">
                <FiCheckCircle className="text-slate-200 w-7 h-7" />
                <span className="self-center text-xl font-semibold whitespace-nowrap text-slate-200">
                  TaskTracker
                </span>
              </Link>
              <div className="space-x-3">
                <Link
                  href="/dashboard"
                  className={`${
                    pathname === "/dashboard"
                      ? "text-gray-100"
                      : "text-gray-400 hover:text-gray-200"
                  } text-sm font-medium`}>
                  Dashboard
                </Link>
                <Link
                  href="/tasks"
                  className={`${
                    pathname === "/tasks"
                      ? "text-gray-100"
                      : "text-gray-400 hover:text-gray-200"
                  } text-sm font-medium`}>
                  Tasks
                </Link>
              </div>
            </div>
          </div>
          <div className="flex md:order-2 items-center space-x-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={""} alt="profile-image" />
                    <AvatarFallback>
                      <PersonIcon className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-base font-medium leading-none">
                      John Doe
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      johndoe@gmail.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <button className="flex items-center">
                    <MdLogout className="mr-1 w-4 h-4" />
                    Log out
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </>
  );
}
