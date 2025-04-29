import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings and preferences.",
};

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <main className="container mx-auto px-4 py-4 min-h-screen md:px-10 lg:max-w-4xl">
      {children}
    </main>
  );
}
