import Navbar from "@/components/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import TanstackProvider from "@/providers/TanstackProvider";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard Page",
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
          <Navbar />
          {children}
        </TanstackProvider>
      </body>
    </html>
  );
}