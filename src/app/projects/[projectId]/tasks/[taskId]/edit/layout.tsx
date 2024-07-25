import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Task",
  description: "Edit project task",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
