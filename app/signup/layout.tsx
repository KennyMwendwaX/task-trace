import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Sign Up page",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
