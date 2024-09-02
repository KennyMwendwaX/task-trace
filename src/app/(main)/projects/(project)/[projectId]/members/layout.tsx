import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Members",
  description: "Project members page",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
