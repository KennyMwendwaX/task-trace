import type { Metadata } from "next";
import RequestsLayoutWrapper from "./components/layout-wrapper";

export const metadata: Metadata = {
  title: "Membership Requests",
  description: "Project membership requests page",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RequestsLayoutWrapper>{children}</RequestsLayoutWrapper>;
}
