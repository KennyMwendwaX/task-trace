import "./globals.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import TanstackProvider from "@/providers/TanstackProvider";
import SessionProvider from "@/providers/SessionProvider";
import { auth } from "../auth";
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
  const session = await auth();
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <SessionProvider session={session}>
          <TanstackProvider>
            {children}
            <Toaster richColors />
          </TanstackProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
