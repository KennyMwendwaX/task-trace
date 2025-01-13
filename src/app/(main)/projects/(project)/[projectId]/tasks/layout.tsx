import type { Metadata } from "next";
import TasksLayoutWrapper from "./components/layout-wrapper";

export const metadata: Metadata = {
  title: "Project Tasks",
  description: "Project tasks page",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
