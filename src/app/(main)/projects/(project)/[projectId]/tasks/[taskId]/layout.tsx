import type { Metadata } from "next";
import TaskLayoutWrapper from "./components/layout-wrapper";

export const metadata: Metadata = {
  title: "Task",
  description: "Task page",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <TaskLayoutWrapper>{children}</TaskLayoutWrapper>;
}
