import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Project page",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
