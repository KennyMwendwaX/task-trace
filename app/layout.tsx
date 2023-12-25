import Navbar from "@/components/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import TanstackProvider from "@/providers/TanstackProvider";
import Layout from "./dashboard/layout";

export const metadata: Metadata = {
  title: "Task Tracker",
  description: "Track tasks in your project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <TanstackProvider>
          <Layout>{children}</Layout>
        </TanstackProvider>
      </body>
    </html>
  );
}
