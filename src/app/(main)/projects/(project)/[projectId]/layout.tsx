import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Overview",
  description: "Project overview page",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
