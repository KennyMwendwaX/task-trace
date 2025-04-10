"use client";

import { Session } from "@/lib/auth";
import ProjectSidebar from "./project-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function LayoutWrapper({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  return (
    <SidebarProvider>
      <ProjectSidebar session={session} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
