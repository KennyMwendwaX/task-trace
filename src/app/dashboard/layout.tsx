import type { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard Page",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="container mx-auto px-4 py-4 bg-muted/40 min-h-screen md:px-10 lg:px-14">
      {children}
      <Toaster richColors />
    </main>
  );
}
