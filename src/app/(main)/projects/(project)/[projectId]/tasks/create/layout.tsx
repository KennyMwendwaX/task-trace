import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Task",
  description: "Create new project task",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
