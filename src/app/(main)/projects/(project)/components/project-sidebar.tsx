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
import Logo from "@/app/logo.png";
import NavLinks from "./nav-links";
import Image from "next/image";
import Link from "next/link";
import { Session } from "@/lib/auth";

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
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image src={Logo} width={32} height={28} alt="" />
                </div>
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
