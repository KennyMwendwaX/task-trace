"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";
import { ReactNode } from "react";
import { Session } from "next-auth";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  const pathname = usePathname();
  const isProjectsRoute = pathname.startsWith("/projects/");
  const excludePaths = ["/", "/signup", "/signin", "/home"];
  const excludedPaths = excludePaths.includes(pathname);

  return (
    <>
      {excludedPaths ? (
        <>{children}</>
      ) : isProjectsRoute ? (
        <> {children}</>
      ) : (
        <>
          <Navbar />
          {children}
        </>
      )}
    </>
  );
}
