import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore",
  description: "Explore projects page",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
