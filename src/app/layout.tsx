import "./globals.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import TanstackProvider from "@/providers/TanstackProvider";
import SessionProvider from "@/providers/SessionProvider";
import Layout from "@/components/layout";
import { auth } from "../auth";

export const metadata: Metadata = {
  title: "TaskTrace",
  description: "Track tasks in your project",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <SessionProvider session={session}>
          <TanstackProvider>
            <Layout>{children}</Layout>
          </TanstackProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
