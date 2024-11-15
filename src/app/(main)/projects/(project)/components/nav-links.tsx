"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LuLineChart,
  LuUsers,
  LuSettings2,
  LuListTodo,
  LuLayoutGrid,
} from "react-icons/lu";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function NavLinks() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;

  const links = [
    {
      url: `/projects/${projectId}`,
      name: "Overview",
      icon: LuLayoutGrid,
    },
    {
      url: `/projects/${projectId}/tasks`,
      name: "Tasks",
      icon: LuListTodo,
    },
    {
      url: `/projects/${projectId}//members`,
      name: "Members",
      icon: LuUsers,
    },
    {
      url: `/projects/${projectId}//analytics`,
      name: "Analytics",
      icon: LuLineChart,
    },
    {
      url: `/projects/${projectId}//settings`,
      name: "Settings",
      icon: LuSettings2,
    },
  ];

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="text-sm">Project</SidebarGroupLabel>
      <SidebarMenu>
        {links.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton className="h-10" asChild>
              <Link href={item.url}>
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
