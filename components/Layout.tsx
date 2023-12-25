"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const excludePaths = ["/", "/signup", "/signin"];

  const excludedPaths = excludePaths.includes(pathname);

  return (
    <>
      {excludedPaths ? (
        <>{children}</>
      ) : (
        <div className="bg-gray-50 min-h-screen">
          <Navbar />
          {children}
        </div>
      )}
    </>
  );
}
