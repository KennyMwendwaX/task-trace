"use client";

import { ChevronsUpDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { IoSettingsOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { signOut } from "@/lib/auth-client";
import type { Session } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Sun } from "lucide-react";
import ThemeToggle from "@/app/(main)/components/theme-toggle";

export default function NavUser({ session }: { session: Session }) {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const userName = session.user?.name ?? "Guest";
  const userEmail = session.user?.email ?? "No email provided";
  const userImage = session.user?.image;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={userImage || ""} alt="profile-image" />
                <AvatarFallback className="rounded-lg">
                  {userName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{userName}</span>
                <span className="truncate text-xs">{userEmail}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={userImage || ""} alt="profile-image" />
                  <AvatarFallback className="rounded-lg">
                    {userName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{userName}</span>
                  <span className="truncate text-xs">{userEmail}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center">
              <IoSettingsOutline className="mr-2 w-5 h-5" /> Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center justify-between">
              <div className="flex items-center">
                <Sun className="mr-2 h-4 w-4" />
                Theme
              </div>
              <ThemeToggle />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
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
              className="flex items-center hover:text-bg-red-100">
              <MdLogout className="mr-2 w-5 h-5" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
