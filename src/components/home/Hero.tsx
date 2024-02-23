import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative">
      {/* Illustration behind hero content */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none -z-10"
        aria-hidden="true">
        <svg
          width="1260"
          height="578"
          viewBox="0 0 1360 578"
          xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient
              x1="50%"
              y1="0%"
              x2="50%"
              y2="100%"
              id="illustration-01">
              <stop stopColor="#FFF" offset="0%" />
              <stop stopColor="#EAEAEA" offset="77.402%" />
              <stop stopColor="#DFDFDF" offset="100%" />
            </linearGradient>
          </defs>
          <g fill="url(#illustration-01)" fillRule="evenodd">
            <circle cx="1232" cy="128" r="128" />
            <circle cx="155" cy="443" r="64" />
          </g>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 z-20">
        {/* Hero content */}
        <div className="pt-32 pb-12 md:pt-40 md:pb-32">
          {/* Section header */}
          <div className="text-center pb-12 md:pb-16">
            <h1
              className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4"
              data-aos="zoom-y-out">
              Streamline Your Task Management and Boost Productivity with &nbsp;
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                TaskTrace
              </span>
            </h1>
            <div className="max-w-3xl mx-auto">
              <p
                className="text-xl text-gray-600 mb-8"
                data-aos="zoom-y-out"
                data-aos-delay="150">
                Empowering Teams to Achieve Seamless Workflow Coordination,
                Superior Task Management, and Unmatched Productivity in your
                All-in-One Solution.
              </p>
              <div
                className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center"
                data-aos="zoom-y-out"
                data-aos-delay="300">
                <Button
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-blue-500 to-teal-500">
                  <Link href="/dashboard">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
