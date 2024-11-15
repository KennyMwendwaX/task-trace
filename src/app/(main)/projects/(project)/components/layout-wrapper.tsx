"use client";

import ProjectSidebar from "./project-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <ProjectSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
