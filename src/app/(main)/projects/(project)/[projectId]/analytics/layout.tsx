import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Analytics",
  description: "Project analytics page",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
