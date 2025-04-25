"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Circle, Clock, XCircle, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const dashboardVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 50, delay: 0.4 },
    },
  };

  // Mock data for the dashboard preview
  const taskStatus = [
    {
      name: "Done",
      count: 32,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10 dark:bg-green-500/20",
      iconBg: "bg-green-500",
    },
    {
      name: "Todo",
      count: 24,
      icon: Circle,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10 dark:bg-blue-500/20",
      iconBg: "bg-blue-500",
    },
    {
      name: "In Progress",
      count: 21,
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10 dark:bg-orange-500/20",
      iconBg: "bg-orange-500",
    },
    {
      name: "Canceled",
      count: 2,
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10 dark:bg-red-500/20",
      iconBg: "bg-red-500",
    },
  ];

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background pointer-events-none -z-10"
        aria-hidden="true"></div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-3xl"></div>
        <div className="absolute top-[60%] -left-[5%] w-[30%] h-[40%] rounded-full bg-teal-500/10 dark:bg-teal-500/5 blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {mounted && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-center">
            {/* Hero content */}
            <motion.div
              variants={itemVariants}
              className="text-center max-w-3xl mb-12">
              <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground text-sm font-medium">
                <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                TaskTrace 2.0 is now available
              </div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tighter mb-6">
                Manage projects with{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-300">
                  clarity and precision
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                TaskTrace helps teams visualize workflow, track progress, and
                deliver projects on time with powerful yet intuitive tools.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="rounded-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 dark:from-blue-500 dark:to-teal-400 w-full sm:w-auto">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full w-full sm:w-auto">
                    View Projects
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Dashboard preview */}
            <motion.div variants={dashboardVariants} className="w-full">
              <div className="relative mx-auto max-w-5xl">
                {/* Browser frame */}
                <div className="rounded-xl overflow-hidden shadow-2xl border border-border">
                  {/* Browser header */}
                  <div className="bg-muted/80 backdrop-blur-sm border-b border-border p-3 flex items-center">
                    <div className="flex space-x-2 mr-4">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="bg-background rounded-full px-4 py-1 text-xs text-muted-foreground w-80 text-center">
                        tasktrace.app/projects/quizify-web-app
                      </div>
                    </div>
                  </div>

                  {/* Dashboard content */}
                  <div className="bg-background p-6">
                    {/* Project header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-md bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white font-bold">
                          Q
                        </div>
                        <div>
                          <h2 className="text-xl font-bold">Quizify web app</h2>
                          <p className="text-sm text-muted-foreground">
                            Web-based quiz application
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground">
                          Private
                        </div>
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium">
                              {["JD", "SM", "AK"][i - 1]}
                            </div>
                          ))}
                          <div className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium">
                            +13
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Task status cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {taskStatus.map((status, index) => (
                        <div
                          key={index}
                          className={`rounded-lg p-4 ${status.bgColor} border border-border/50`}>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium">
                              {status.name}
                            </h3>
                            <status.icon
                              className={`w-5 h-5 ${status.color}`}
                            />
                          </div>
                          <p className="text-3xl font-bold">{status.count}</p>
                        </div>
                      ))}
                    </div>

                    {/* Progress bar */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                          Project Progress
                        </span>
                        <span className="text-sm font-medium">40%</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-teal-400 w-[40%]"></div>
                      </div>
                    </div>

                    {/* Recent activity */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium">Recent Activity</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs">
                          View All
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium shrink-0">
                              {["SM", "JD", "AK"][i - 1]}
                            </div>
                            <div>
                              <p className="text-sm">
                                <span className="font-medium">
                                  {
                                    ["Sarah Miller", "John Doe", "Alex Kim"][
                                      i - 1
                                    ]
                                  }
                                </span>{" "}
                                {
                                  [
                                    "completed task ",
                                    "moved task ",
                                    "commented on task ",
                                  ][i - 1]
                                }
                                <span className="font-medium">
                                  {
                                    [
                                      "Update homepage hero section",
                                      "Implement contact form",
                                      "Design product page layout",
                                    ][i - 1]
                                  }
                                </span>
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {
                                  ["2 hours ago", "4 hours ago", "Yesterday"][
                                    i - 1
                                  ]
                                }
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -top-6 -right-6 bg-card p-4 rounded-lg shadow-lg border border-border">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">
                      8 Tasks Completed Today
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="absolute -bottom-6 -left-6 bg-card p-4 rounded-lg shadow-lg border border-border">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium">
                      Project on track
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
