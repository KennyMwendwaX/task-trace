import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team",
  description: "Team section page",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
