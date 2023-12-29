"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { LuCalendarClock, LuUser2 } from "react-icons/lu";
import { RxDashboard } from "react-icons/rx";
import { FiCheckCircle, FiUsers } from "react-icons/fi";
import { IoFileTrayOutline } from "react-icons/io5";

export default function Sidebar() {
  return (
    <>
      <Sheet>
        <Button
          className="bg-transparent border border-slate-500 py-1.5 px-2.5"
          asChild>
          <SheetTrigger>
            <HamburgerMenuIcon className="w-5 h-5" />
          </SheetTrigger>
        </Button>
        <SheetContent side="left" className="w-[350px] rounded-r-2xl">
          <SheetHeader>
            <SheetTitle className="ml-2 text-3xl flex items-center text-slate-900 space-x-2">
              <FiCheckCircle className="w-7 h-7" />
              <span>TaskTracker</span>
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-1.5 pt-2">
            <Link
              href="/dashboard"
              className="flex items-center py-2 space-x-4 rounded-lg cursor-pointer hover:bg-slate-200">
              <RxDashboard className="ml-2 w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/tasks"
              className="flex items-center py-2 space-x-4 rounded-lg cursor-pointer hover:bg-slate-200">
              <IoFileTrayOutline className="ml-2 w-6 h-6" />
              <span>Tasks</span>
            </Link>
            <Link
              href="/upcoming"
              className="flex items-center py-2 space-x-4 rounded-lg cursor-pointer hover:bg-slate-200">
              <LuCalendarClock className="ml-2 w-6 h-6" />
              <span>Upcoming</span>
            </Link>
            <Link
              href="/team"
              className="flex items-center py-2 space-x-4 rounded-lg cursor-pointer hover:bg-slate-200">
              <FiUsers className="ml-2 w-5 h-5" />
              <span>Team</span>
            </Link>
          </div>
          <div className="absolute bottom-2 px-3 flex items-center space-x-2 bg-slate-200 rounded-xl">
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
        </SheetContent>
      </Sheet>
    </>
  );
}
