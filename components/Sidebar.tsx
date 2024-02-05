"use client";

import { usePathname } from "next/navigation";

import { CalendarIcon, HomeIcon, ProjectorIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LuUser2, LuCalendar, LuProjector, LuUsers } from "react-icons/lu";
import { RxDashboard } from "react-icons/rx";
import { Session } from "next-auth/types";

type Props = {
  session: Session | null;
};

export default function Sidebar({ session }: Props) {
  return (
    <>
      <aside
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform -translate-x-full bg-gray-50 border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidenav"
        id="drawer-navigation">
        <div className="overflow-y-auto py-5 px-3 h-full">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <RxDashboard className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ml-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/projects"
                className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <LuProjector className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ml-3">Projects</span>
              </Link>
            </li>
            <li>
              <Link
                href="/team"
                className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <LuUsers className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ml-3"> Team</span>
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <CalendarIcon className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ml-3"> Schedule</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="hidden absolute bottom-0 left-0 justify-center p-4 space-x-4 w-full lg:flex z-20">
          <div className="px-6 flex items-center space-x-2 bg-slate-200 rounded-xl">
            <Avatar>
              <AvatarImage src={""} />
              <AvatarFallback>
                <LuUser2 className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div className="py-2 space-y-1">
              <div className="pt-1">{session?.user?.name}</div>
              <span className="text-muted-foreground text-sm pb-1">
                {session?.user?.email}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
