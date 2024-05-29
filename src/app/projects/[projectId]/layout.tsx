import type { Metadata } from "next";
import ProjectNavbar from "@/components/ProjectNavbar";

export const metadata: Metadata = {
  title: "Project",
  description: "Project page",
};

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ProjectNavbar />
      <Sidebar />
      {children}
    </>
  );
}
