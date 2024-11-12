import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Membership Requests",
  description: "Project membership requests page",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
