import type { Metadata } from "next";
import MembersLayoutWrapper from "./components/layout-wrapper";

export const metadata: Metadata = {
  title: "Project Members",
  description: "Project members page",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <MembersLayoutWrapper>{children}</MembersLayoutWrapper>;
}
