"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const excludePaths = ["/", "/signup", "/signin"];

  const excludedPaths = excludePaths.includes(pathname);

  return (
    <>
      {excludedPaths ? (
        <>{children}</>
      ) : (
        <div className="min-h-screen">
          <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
              <Sidebar />
            </div>
            <div className="flex flex-col">
              <Navbar />
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
