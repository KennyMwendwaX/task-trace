import "./globals.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import TanstackProvider from "@/providers/tanstack-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "TaskTrace",
  description: "Track tasks in your project",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <TanstackProvider>
          {children}
          <Toaster richColors />
        </TanstackProvider>
      </body>
    </html>
  );
}
