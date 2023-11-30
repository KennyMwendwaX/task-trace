import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tasks",
  description: "Tasks page",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
