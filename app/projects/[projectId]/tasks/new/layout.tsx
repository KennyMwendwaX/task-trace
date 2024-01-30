import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add New Task",
  description: "Add new task page",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
