"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { MdLogout } from "react-icons/md";
import { logout } from "@/actions/auth/logout";
import { Session } from "next-auth";

interface Props {
  session: Session | null;
}

export default function Header({ session }: Props) {
  const [top, setTop] = useState<boolean>(true);

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
              {/* <Logo /> */}
              <Link
                href="/"
                className="self-center text-3xl font-semibold whitespace-nowrap text-slate-800">
                PesaIQ
              </Link>
            </div>

            {/* Desktop navigation */}
            <nav className="hidden md:flex md:grow">
              {/* Desktop sign in links */}

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

            {/* <MobileMenu /> */}
          </div>
        </div>
      </header>
    </>
  );
}
