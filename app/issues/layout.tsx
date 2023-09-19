import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Issues",
  description: "Issues page",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
