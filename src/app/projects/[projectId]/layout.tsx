import type { Metadata } from "next";
import ProjectNavbar from "@/components/ProjectNavbar";
import Sidebar from "./components/sidebar";

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
