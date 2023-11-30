import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Task",
  description: "Add new task page",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
