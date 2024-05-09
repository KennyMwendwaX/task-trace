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
  // const isProjectsRoute = pathname.startsWith("/projects");
  const excludePaths = ["/", "/signup", "/signin", "/home"];
  const excludedPaths = excludePaths.includes(pathname);

  return (
    <>
      {excludedPaths ? (
        <>{children}</>
      ) : (
        // : isProjectsRoute ? (
        //   <div className="antialiased"> {children}</div>
        // )
        <div className="antialiased">
          <Navbar session={session} />
          <main className="container mx-auto px-14 py-4">{children}</main>
        </div>
      )}
    </>
  );
}
