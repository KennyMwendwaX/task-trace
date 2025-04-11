import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Task",
  description: "Task page",
};

export default async function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
