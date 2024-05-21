import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tasks",
  description: "Users tasks",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
