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
          {/* <Navbar /> */}
          <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
              <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-[60px] items-center border-b px-6">
                  <Link
                    className="flex items-center gap-2 font-semibold"
                    href="#">
                    <ProjectorIcon className="h-6 w-6" />
                    <span>Task Tracker</span>
                  </Link>
                </div>
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
              <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
                <Link className="lg:hidden" href="#">
                  <ProjectorIcon className="h-6 w-6" />
                  <span className="sr-only">Home</span>
                </Link>
                <div className="w-full flex-1">
                  <form>
                    <div className="relative">
                      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <Input
                        className="w-full bg-white shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3 dark:bg-gray-950"
                        placeholder="Search projects..."
                        type="search"
                      />
                    </div>
                  </form>
                </div>
                <div className="relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={""} alt="profile-image" />
                          <AvatarFallback>
                            <PersonIcon className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56"
                      align="end"
                      forceMount>
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
              </header>
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
