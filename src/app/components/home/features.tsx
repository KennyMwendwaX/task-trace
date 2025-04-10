import { BsTrophy } from "react-icons/bs";
import { FiPieChart } from "react-icons/fi";
import { LuCircleDollarSign } from "react-icons/lu";
import { RiGraduationCapLine } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";
import { TbTargetArrow } from "react-icons/tb";

export default function Features() {
  return (
    <section className="relative bg-gray-50">
      {/* Section background (needs .relative class on parent and next sibling elements) */}
      <div
        className="absolute inset-0 top-1/2 md:mt-24 lg:mt-0 bg-gray-900 pointer-events-none"
        aria-hidden="true"></div>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Explore the Key Features
            </h2>
            <p className="text-xl text-gray-600">
              Discover a World of Financial Freedom: Uncover PesaIQ&apos;s
              Powerful Tools and Features to Revolutionize Your Financial
              Journey.
            </p>
          </div>

          {/* Items */}
          <div className="max-w-sm mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start md:max-w-2xl lg:max-w-none">
            {/* 1st item */}
            <div className="relative flex flex-col items-center p-6 space-y-2 bg-white rounded shadow-xl">
              <div className="flex justify-center p-4 items-center bg-blue-600 hover:bg-white-100 rounded-full">
                <FiPieChart className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">
                Holistic Financial Management
              </h4>
              <p className="text-gray-600 text-center">
                Provide users with tools to manage various aspects of their
                finances in one central location.
              </p>
            </div>

            {/* 2nd item */}
            <div className="relative flex flex-col items-center p-6 space-y-2 bg-white rounded shadow-xl">
              <div className="flex justify-center p-4 items-center bg-blue-600 hover:bg-white-100 rounded-full">
                <LuCircleDollarSign className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">
                Investment Hub
              </h4>
              <p className="text-gray-600 text-center">
                Includes insights for market trends, and resources for stocks,
                cryptocurrencies, bonds, and other investment options.
              </p>
            </div>

            {/* 3rd item */}
            <div className="relative flex flex-col items-center p-6 space-y-2 bg-white rounded shadow-xl">
              <div className="flex justify-center p-3.5 items-center bg-blue-600 hover:bg-white-100 rounded-full">
                <TbTargetArrow className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">
                Personalized Insights
              </h4>
              <p className="text-gray-600 text-center">
                Implement algorithms that analyze user data to provide
                personalized insights and recommendations.
              </p>
            </div>

            {/* 4th item */}
            <div className="relative flex flex-col items-center p-6 space-y-2 bg-white rounded shadow-xl">
              <div className="flex justify-center p-4 items-center bg-blue-600 hover:bg-white-100 rounded-full">
                <BsTrophy className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">
                Goal Tracking and Planning
              </h4>
              <p className="text-gray-600 text-center">
                Provide tools that help users plan for major life events and
                enable users to set and track financial goals.
              </p>
            </div>

            {/* 5th item */}
            <div className="relative flex flex-col items-center p-6 space-y-2 bg-white rounded shadow-xl">
              <div className="flex justify-center p-4 items-center bg-blue-600 hover:bg-white-100 rounded-full">
                <RiGraduationCapLine className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">
                Educational Resources
              </h4>
              <p className="text-gray-600 text-center">
                Offer comprehensive educational content on financial literacy
                which includes articles and interactive guides.
              </p>
            </div>

            {/* 6th item */}
            <div className="relative flex flex-col items-center p-6 space-y-2 bg-white rounded shadow-xl">
              <div className="flex justify-center p-4 items-center bg-blue-600 hover:bg-white-100 rounded-full">
                <RxDashboard className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">
                User-friendly Dashboard
              </h4>
              <p className="text-gray-600 text-center">
                Intuitive and user-friendly dashboard that consolidates
                financial information and easy access to features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
