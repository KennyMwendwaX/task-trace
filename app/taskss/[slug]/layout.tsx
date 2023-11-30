import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Task",
  description: "Single task page",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
