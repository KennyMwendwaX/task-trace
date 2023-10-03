import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Task",
  description: "Add tasks page",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
