"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // Assuming this is shadcn/ui Button
import { MdLogout, MdMenu, MdClose } from "react-icons/md";
import { signOut } from "@/lib/auth-client";
import { Session } from "@/lib/auth";
import { useRouter } from "next/navigation";
import ThemeLogo from "@/app/(main)/components/theme-logo";

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
        isScrolled ? "bg-white backdrop-blur-sm shadow-lg md:bg-opacity-90" : ""
      }`}>
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="shrink-0 mr-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-semibold whitespace-nowrap p-2"
              onClick={closeMobileMenu}>
              <ThemeLogo />
              <span className="text-2xl tracking-tighter">TaskTrace</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex md:grow justify-end">
            <ul className="flex items-center space-x-2">
              <li>
                <Link href="/dashboard">
                  <Button size="lg" className="rounded-full">
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
                    size="lg"
                    className="flex items-center rounded-full">
                    <MdLogout className="mr-1 w-5 h-5" />
                    Sign out
                  </Button>
                </li>
              ) : (
                <li>
                  <Link href="/sign-in">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full">
                      Sign in
                    </Button>
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              size="sm"
              variant="ghost"
              className="text-gray-500 hover:text-gray-600">
              <span className="sr-only">Toggle menu</span>
              {isMobileMenuOpen ? (
                <MdClose className="w-6 h-6" />
              ) : (
                <MdMenu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu (Overlay and Drawer) */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={closeMobileMenu}></div>

          <div
            className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out md:hidden ${
              isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}>
            <div className="flex flex-col h-full p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1 font-semibold whitespace-nowrap"
                  onClick={closeMobileMenu}>
                  <ThemeLogo />
                  <span className="text-xl tracking-tighter">
                    TaskTrace
                  </span>{" "}
                </Link>
                <Button
                  onClick={closeMobileMenu}
                  size="sm"
                  variant="ghost"
                  className="text-gray-500 hover:text-gray-600">
                  <span className="sr-only">Close menu</span>
                  <MdClose className="w-6 h-6" />
                </Button>
              </div>

              {/* Navigation Links/Buttons */}
              <nav className="flex flex-col items-start space-y-4">
                <Link
                  href="/dashboard"
                  onClick={closeMobileMenu}
                  className="w-full">
                  <Button size="lg" className="w-full">
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
                    size="lg"
                    className="w-full">
                    <MdLogout className="mr-2 w-5 h-5 inline" />
                    Sign out
                  </Button>
                ) : (
                  <Link
                    href="/sign-in"
                    onClick={closeMobileMenu}
                    className="w-full">
                    <Button size="lg" variant="outline" className="w-full">
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
