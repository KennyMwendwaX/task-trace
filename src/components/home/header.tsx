"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { MdLogout, MdMenu, MdClose } from "react-icons/md";
import { logout } from "@/server/actions/auth/logout";
import { Session } from "next-auth";
import Logo from "@/app/logo.png";

interface Props {
  session: Session | null;
}

export default function Header({ session }: Props) {
  const [top, setTop] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // detect whether user has scrolled the page down by 10px
  const scrollHandler = () => {
    window.scrollY > 10 ? setTop(false) : setTop(true);
  };

  useEffect(() => {
    scrollHandler();
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [top]);

  return (
    <>
      <header
        className={`fixed w-full z-30 md:bg-opacity-90 transition duration-300 ease-in-out ${
          !top ? "bg-white backdrop-blur-sm shadow-lg" : ""
        }`}>
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Site branding */}
            <div className="shrink-0 mr-4">
              <Link
                href="/"
                className="flex items-center gap-1 font-semibold whitespace-nowrap p-2">
                <Image src={Logo} width={34} height={30} alt="" />
                <span className="text-2xl tracking-tighter">TaskTrace</span>
                <span className="sr-only">Logo</span>
              </Link>
            </div>

            {/* Desktop navigation */}
            <nav className="hidden md:flex md:grow">
              {session != null ? (
                <ul className="flex grow justify-end flex-wrap items-center space-x-2">
                  <li>
                    <Link href="/dashboard">
                      <Button
                        size="lg"
                        variant="outline"
                        className="flex items-center rounded-full">
                        <span>Get Started</span>
                      </Button>
                    </Link>
                  </li>
                  <li>
                    <Button
                      onClick={() => logout()}
                      size="lg"
                      className="flex items-center rounded-full">
                      <MdLogout className="mr-1 w-5 h-5" />
                      <span>Sign out</span>
                    </Button>
                  </li>
                </ul>
              ) : (
                <ul className="flex grow justify-end flex-wrap items-center space-x-2">
                  <li>
                    <Link href="/signin">
                      <Button
                        size="lg"
                        variant="outline"
                        className="flex items-center rounded-full">
                        <span>Sign in</span>
                      </Button>
                    </Link>
                  </li>
                  <li>
                    <Link href="/signup">
                      <Button
                        size="lg"
                        className="flex items-center rounded-full">
                        <span>Sign up</span>
                        <IoIosArrowRoundForward className="ml-1 w-5 h-5" />
                      </Button>
                    </Link>
                  </li>
                </ul>
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                size="sm"
                variant="ghost"
                className="text-gray-500 hover:text-gray-600">
                {mobileMenuOpen ? (
                  <MdClose className="w-6 h-6" />
                ) : (
                  <MdMenu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`fixed inset-0 z-50 md:hidden bg-white transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}>
          <div className="flex flex-col h-full justify-center items-center">
            {session != null ? (
              <>
                <Link href="/dashboard" className="mb-4">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full text-center"
                    onClick={() => setMobileMenuOpen(false)}>
                    Get Started
                  </Button>
                </Link>
                <Button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  size="lg"
                  className="w-full text-center">
                  <MdLogout className="mr-2 w-5 h-5 inline" />
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link href="/signin" className="mb-4">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full text-center"
                    onClick={() => setMobileMenuOpen(false)}>
                    Sign in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="w-full text-center"
                    onClick={() => setMobileMenuOpen(false)}>
                    Sign up
                    <IoIosArrowRoundForward className="ml-2 w-5 h-5 inline" />
                  </Button>
                </Link>
              </>
            )}
          </div>
          <Button
            onClick={() => setMobileMenuOpen(false)}
            size="sm"
            variant="ghost"
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-600">
            <MdClose className="w-6 h-6" />
          </Button>
        </div>
      </header>
    </>
  );
}
