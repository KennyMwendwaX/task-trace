import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Settings",
  description: "Project settings page",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
