import type { Metadata } from "next";
import LayoutWrapper from "./components/layout-wrapper";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Project",
  description: "Project page",
};

export default async function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return <LayoutWrapper session={session}>{children}</LayoutWrapper>;
}
