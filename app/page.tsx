import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardContent, Card, CardHeader } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { JSX, SVGProps } from "react";

export default function Home() {
  return (
    <>
      <header className="fixed top-0 w-full bg-blue-900 text-white flex items-center justify-between px-6 py-4 z-50 transition duration-500 ease-in-out transform">
        <div className="flex items-center space-x-4">
          <CheckCircleIcon className="w-6 h-6" />
          <span className="text-lg font-semibold">Task Tracker</span>
        </div>
        <nav className="flex space-x-4">
          <Link className="text-sm hover:underline" href="#">
            About
          </Link>
          <Link className="text-sm hover:underline" href="#">
            Features
          </Link>
          <Link className="text-sm hover:underline" href="#">
            Pricing
          </Link>
          <Link className="text-sm hover:underline" href="#">
            Contact
          </Link>
        </nav>
      </header>
      <main
        className="space-y-12 py-8 px-6 pt-24"
        style={{
          backgroundImage: "url('/background.svg')",
        }}>
        <section
          className="space-y-8 text-center bg-contain bg-no-repeat bg-center"
          style={{
            backgroundImage: "url('/bg-home.svg')",
          }}>
          <h1 className="text-4xl font-bold">Manage tasks with ease</h1>
          <p className="text-xl text-gray-600">
            Track tasks, manage your time, and collaborate with your team.
          </p>
          <div className="flex justify-center">
            <Button
              size="lg"
              className="rounded-full bg-gradient-to-r from-blue-500 to-teal-500">
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </section>
        <section
          className="space-y-8 bg-contain bg-no-repeat bg-center"
          style={{
            backgroundImage: "url('/bg-features.svg')",
          }}>
          <h2 className="text-3xl font-bold text-center">Key Features</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-blue-100">
              <CardContent className="space-y-2">
                <ClockIcon className="w-6 h-6 mx-auto" />
                <h3 className="text-lg font-semibold text-center">
                  Time management
                </h3>
                <p className="text-sm text-gray-600">
                  Keep track of your tasks and get more done.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-blue-100">
              <CardContent className="space-y-2">
                <User2Icon className="w-6 h-6 mx-auto" />
                <h3 className="text-lg font-semibold text-center">
                  Collaboration
                </h3>
                <p className="text-sm text-gray-600">
                  Work together with your team on shared tasks.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-blue-100">
              <CardContent className="space-y-2">
                <BarChartIcon className="w-6 h-6 mx-auto" />
                <h3 className="text-lg font-semibold text-center">
                  Performance tracking
                </h3>
                <p className="text-sm text-gray-600">
                  Get insights on your productivity and improve your
                  performance.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-blue-100">
              <CardContent className="space-y-2">
                <BarChartIcon className="w-6 h-6 mx-auto" />
                <h3 className="text-lg font-semibold text-center">
                  Progress tracking
                </h3>
                <p className="text-sm text-gray-600">
                  Track your progress on tasks and projects over time.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-blue-100">
              <CardContent className="space-y-2">
                <UtensilsIcon className="w-6 h-6 mx-auto" />
                <h3 className="text-lg font-semibold text-center">
                  Integration with other tools
                </h3>
                <p className="text-sm text-gray-600">
                  Easily integrate with other tools you use for your work.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-blue-100">
              <CardContent className="space-y-2">
                <SmileIcon className="w-6 h-6 mx-auto" />
                <h3 className="text-lg font-semibold text-center">
                  User-friendly interface
                </h3>
                <p className="text-sm text-gray-600">
                  Enjoy a clean, intuitive, and easy-to-use interface.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
        <section
          className="space-y-8 bg-contain bg-no-repeat bg-center"
          style={{
            backgroundImage: "url('/bg-testimonials.svg')",
          }}>
          <h2 className="text-3xl font-bold text-center">Testimonials</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {/* <Card className="bg-blue-100">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Avatar src="/placeholder.svg?height=40&width=40" />
                  <div>
                    <div className="text-sm font-semibold">John Doe</div>
                    <Badge>Verified User</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  "Task Tracker has improved our productivity by 30%. Highly recommended!"
                </p>
              </CardContent>
            </Card>
            <Card className="bg-blue-100">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Avatar src="/placeholder.svg?height=40&width=40" />
                  <div>
                    <div className="text-sm font-semibold">Jane Smith</div>
                    <Badge>Verified User</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  "The collaboration feature is a game changer for our remote team."
                </p>
              </CardContent>
            </Card>
            <Card className="bg-blue-100">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Avatar src="/placeholder.svg?height=40&width=40" />
                  <div>
                    <div className="text-sm font-semibold">Alex Johnson</div>
                    <Badge>Verified User</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  "The performance tracking feature helps me stay focused on my tasks."
                </p>
              </CardContent>
            </Card> */}
          </div>
        </section>
        <section
          className="space-y-8 text-center bg-contain bg-no-repeat bg-center"
          style={{
            backgroundImage: "url('/bg-getstarted.svg')",
          }}>
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <p className="text-xl text-gray-600">
            Join Task Tracker today and boost your productivity.
          </p>
          <div className="flex justify-center">
            <Button>Sign Up Now</Button>
          </div>
        </section>
      </main>
      <footer className="border-t py-4 px-6 text-center bg-blue-900 text-white">
        <p className="text-sm">© Task Tracker. All rights reserved.</p>
      </footer>
    </>
  );
}

function BarChartIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  );
}

function CheckCircleIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function ClockIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function SmileIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
    </svg>
  );
}

function User2Icon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 1 0-16 0" />
    </svg>
  );
}

function UtensilsIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  );
}
