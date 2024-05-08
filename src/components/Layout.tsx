"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import { ReactNode } from "react";
import { Session } from "next-auth";

type Props = {
  children: ReactNode;
  session: Session | null;
};

export default function Layout({ children, session }: Props) {
  const pathname = usePathname();
  const excludePaths = ["/", "/signup", "/signin", "/projects"];
  const excludedPaths = excludePaths.includes(pathname);

  return (
    <>
      {excludedPaths ? (
        <>{children}</>
      ) : (
        <div className="antialiased">
          <Navbar session={session} />
          {children}
        </div>
      )}
    </>
  );
}
