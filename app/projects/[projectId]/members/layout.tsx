import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Members",
  description: "Members section page",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
