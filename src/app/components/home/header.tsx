"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import type { Session } from "@/lib/auth";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/app/(main)/components/theme-toggle";

interface Props {
  session: Session | null;
}

export default function Header({ session }: Props) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 10);
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to close the mobile menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-30 transition duration-300 ease-in-out ${
        isScrolled
          ? "bg-background/90 backdrop-blur-sm shadow-sm dark:bg-background/90 dark:border-b dark:border-border"
          : ""
      }`}>
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="shrink-0 mr-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-semibold whitespace-nowrap p-2"
              onClick={closeMobileMenu}>
              <div className="w-8 h-8 rounded-md bg-black text-white dark:bg-white dark:text-black flex items-center justify-center text-xl font-bold">
                T
              </div>
              <span className="text-2xl tracking-tighter">TaskTrace</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex md:grow justify-end">
            <ul className="flex items-center space-x-3">
              <li>
                <ThemeToggle />
              </li>
              <li>
                <Link href="/dashboard">
                  <Button className="rounded-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 dark:from-blue-500 dark:to-teal-400 w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
              </li>
              {session ? (
                <li>
                  <Button
                    variant="outline"
                    onClick={() =>
                      signOut({
                        fetchOptions: {
                          onSuccess: () => {
                            router.refresh();
                          },
                        },
                      })
                    }
                    className="flex items-center rounded-full">
                    <LogOut className="mr-1 w-4 h-4" />
                    Sign out
                  </Button>
                </li>
              ) : (
                <li>
                  <Link href="/sign-in">
                    <Button variant="outline" className="rounded-full">
                      Sign in
                    </Button>
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              size="sm"
              variant="ghost"
              className="text-foreground/70 hover:text-foreground">
              <span className="sr-only">Toggle menu</span>
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu (Overlay and Drawer) */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={closeMobileMenu}></div>

          <div
            className={`fixed top-0 right-0 h-full w-full max-w-sm bg-background shadow-lg z-50 transition-transform duration-300 ease-in-out md:hidden ${
              isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}>
            <div className="flex flex-col h-full p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 font-semibold whitespace-nowrap"
                  onClick={closeMobileMenu}>
                  <div className="w-8 h-8 rounded-md bg-black text-white dark:bg-white dark:text-black flex items-center justify-center text-xl font-bold">
                    T
                  </div>
                  <span className="text-xl tracking-tighter">TaskTrace</span>
                </Link>
                <Button
                  onClick={closeMobileMenu}
                  size="sm"
                  variant="ghost"
                  className="text-foreground/70 hover:text-foreground">
                  <span className="sr-only">Close menu</span>
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* Navigation Links/Buttons */}
              <nav className="flex flex-col items-start space-y-4">
                <Link
                  href="/dashboard"
                  onClick={closeMobileMenu}
                  className="w-full">
                  <Button size="sm" className="w-full">
                    Get Started
                  </Button>
                </Link>
                {session ? (
                  <Button
                    onClick={() => {
                      signOut({
                        fetchOptions: { onSuccess: () => router.refresh() },
                      });
                      closeMobileMenu();
                    }}
                    size="sm"
                    className="w-full">
                    <LogOut className="mr-2 w-4 h-4 inline" />
                    Sign out
                  </Button>
                ) : (
                  <Link
                    href="/sign-in"
                    onClick={closeMobileMenu}
                    className="w-full">
                    <Button size="sm" variant="outline" className="w-full">
                      Sign in
                    </Button>
                  </Link>
                )}
              </nav>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
