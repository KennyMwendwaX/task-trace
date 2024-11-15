import type { Metadata } from "next";
import LayoutWrapper from "./components/layout-wrapper";

export const metadata: Metadata = {
  title: "Project",
  description: "Project page",
};

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutWrapper>{children}</LayoutWrapper>;
}
