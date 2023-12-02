import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Task",
  description: "Task page",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
