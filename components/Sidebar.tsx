"use client";

import { usePathname } from "next/navigation";

import { CalendarIcon, HomeIcon, ProjectorIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LuUser2, LuCalendar, LuProjector, LuUsers } from "react-icons/lu";
import { RxDashboard } from "react-icons/rx";

export default function Sidebar() {
  return (
    <>
      <aside className="flex h-full max-h-screen flex-col gap-2 pt-[70px]">
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 items-start px-4 text-sm font-medium">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-50">
              <RxDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              href="/projects"
              className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2.5 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50">
              <LuProjector className="h-4 w-4" />
              Projects
            </Link>
            <Link
              href="/team"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-50">
              <LuUsers className="h-4 w-4" />
              Team
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-50">
              <CalendarIcon className="h-4 w-4" />
              Schedule
            </Link>
            <div className="absolute bottom-2 px-8 flex items-center space-x-2 bg-slate-200 rounded-xl">
              <Avatar>
                <AvatarImage src={""} />
                <AvatarFallback>
                  <LuUser2 className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div className="py-2 space-y-1">
                <div className="pt-1">John Doe</div>
                <span className="text-muted-foreground text-sm pb-1">
                  johndoe@gmail.com
                </span>
              </div>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}
