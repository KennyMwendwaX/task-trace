import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";
import ThemeLogo from "@/app/(main)/components/theme-logo";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top area: Blocks */}
        <div className="grid sm:grid-cols-12 gap-8 py-8 md:py-12">
          {/* 1st block */}
          <div className="sm:col-span-12 lg:col-span-3">
            <div className="mb-2">
              <Link href="/" className="inline-flex items-center gap-2">
                <ThemeLogo />
                <span className="text-xl font-semibold">TaskTrace</span>
              </Link>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Streamline task management and boost productivity with our
              collaborative project tracking platform.
            </p>
          </div>

          {/* 2nd block */}
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h6 className="text-gray-800 font-medium mb-2">Product</h6>
            <ul className="text-sm">
              <li className="mb-2">
                <Link
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">
                  Features
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">
                  Pricing
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">
                  Integrations
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          {/* 3rd block */}
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h6 className="text-gray-800 font-medium mb-2">Company</h6>
            <ul className="text-sm">
              <li className="mb-2">
                <Link
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">
                  About
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">
                  Blog
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">
                  Careers
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* 4th block */}
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h6 className="text-gray-800 font-medium mb-2">Resources</h6>
            <ul className="text-sm">
              <li className="mb-2">
                <Link
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">
                  Documentation
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">
                  Tutorials
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">
                  Support
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* 5th block */}
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-3">
            <h6 className="text-gray-800 font-medium mb-2">Subscribe</h6>
            <p className="text-sm text-gray-600 mb-4">
              Get the latest news and updates delivered to your inbox.
            </p>
            <form className="mb-4 flex space-x-2">
              <Input
                type="email"
                className="focus-visible:ring-blue-500"
                placeholder="Your email address"
              />
              <Button type="submit" className="shrink-0">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom area */}
        <div className="md:flex md:items-center md:justify-between py-4 md:py-8 border-t border-gray-200">
          {/* Social links */}
          <ul className="flex mb-4 md:order-1 md:ml-4 md:mb-0">
            <li>
              <Link
                href="#"
                className="flex justify-center items-center text-gray-600 hover:text-gray-900 bg-white hover:bg-white-100 rounded-full shadow transition duration-150 ease-in-out p-2">
                <span className="sr-only">Twitter</span>
                <Twitter className="w-4 h-4" />
              </Link>
            </li>
            <li className="ml-4">
              <Link
                href="#"
                className="flex justify-center items-center text-gray-600 hover:text-gray-900 bg-white hover:bg-white-100 rounded-full shadow transition duration-150 ease-in-out p-2">
                <span className="sr-only">Github</span>
                <Github className="w-4 h-4" />
              </Link>
            </li>
            <li className="ml-4">
              <Link
                href="#"
                className="flex justify-center items-center text-gray-600 hover:text-gray-900 bg-white hover:bg-white-100 rounded-full shadow transition duration-150 ease-in-out p-2">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="w-4 h-4" />
              </Link>
            </li>
          </ul>

          {/* Copyrights note */}
          <div className="text-sm text-gray-600 mr-4">
            &copy; {new Date().getFullYear()} TaskTrace. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
