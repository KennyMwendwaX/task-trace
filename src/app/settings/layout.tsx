import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Settings page",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
