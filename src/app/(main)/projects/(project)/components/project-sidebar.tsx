"use client";

import NavUser from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import NavLinks from "./nav-links";
import Link from "next/link";
import { Session } from "@/lib/auth";
import ThemeLogo from "@/app/(main)/components/theme-logo";

interface ProjectSidebarProps extends React.ComponentProps<typeof Sidebar> {
  session: Session;
}

export default function ProjectSidebar({
  session,
  ...props
}: ProjectSidebarProps) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <ThemeLogo />
                <div className="flex-1 text-left text-base leading-tight">
                  <span className="truncate font-semibold">TaskTrace</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavLinks />
      </SidebarContent>
      <SidebarFooter>
        <NavUser session={session} />
      </SidebarFooter>
    </Sidebar>
  );
}
