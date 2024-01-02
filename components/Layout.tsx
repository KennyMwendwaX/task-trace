"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import {
  CalendarIcon,
  HomeIcon,
  ProjectorIcon,
  SearchIcon,
  UsersIcon,
} from "lucide-react";
import { Input } from "./ui/input";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { PersonIcon } from "@radix-ui/react-icons";
import { MdLogout } from "react-icons/md";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const excludePaths = ["/", "/signup", "/signin"];

  const excludedPaths = excludePaths.includes(pathname);

  return (
    <>
      {excludedPaths ? (
        <>{children}</>
      ) : (
        <div className="min-h-screen">
          <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
              <div className="flex h-full max-h-screen flex-col gap-2">
                {/* <div className="flex h-[60px] items-center border-b px-6">
                  <Link
                    className="flex items-center gap-2 font-semibold"
                    href="#">
                    <ProjectorIcon className="h-6 w-6" />
                    <span>Task Tracker</span>
                  </Link>
                </div> */}
                <div className="flex-1 overflow-auto py-2">
                  <nav className="grid items-start px-4 text-sm font-medium">
                    <Link
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                      href="#">
                      <HomeIcon className="h-4 w-4" />
                      Home
                    </Link>
                    <Link
                      className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
                      href="#">
                      <ProjectorIcon className="h-4 w-4" />
                      Projects
                    </Link>
                    <Link
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                      href="#">
                      <UsersIcon className="h-4 w-4" />
                      Team
                    </Link>
                    <Link
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                      href="#">
                      <CalendarIcon className="h-4 w-4" />
                      Schedule
                    </Link>
                  </nav>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <Navbar />
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
