import type { Metadata } from "next";
import AnalyticsLayoutWrapper from "./components/layout-wrapper";

export const metadata: Metadata = {
  title: "Project Analytics",
  description: "Project analytics page",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AnalyticsLayoutWrapper>{children}</AnalyticsLayoutWrapper>;
}
