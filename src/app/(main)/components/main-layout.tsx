"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  const pathname = usePathname();
  const isProjectsRoute = pathname.startsWith("/projects/");

  return (
    <>
      {isProjectsRoute ? (
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
