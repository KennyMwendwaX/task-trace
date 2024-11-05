import type { Metadata } from "next";
import SettingsLayoutWrapper from "./components/layout-wrapper";

export const metadata: Metadata = {
  title: "Project Settings",
  description: "Project settings page",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SettingsLayoutWrapper>{children}</SettingsLayoutWrapper>;
}
