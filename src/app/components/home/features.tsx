"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Users,
  BarChart3,
  Brain,
  Zap,
  Shield,
  Globe,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function Features() {
  const [activeTab, setActiveTab] = useState("task-management");

  const features = [
    {
      id: "task-management",
      title: "Task Management",
      description:
        "Create, organize, and track tasks with powerful visual tools.",
      icon: CheckCircle,
      color: "from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500",
      lightBg: "from-blue-50 to-blue-100",
      darkBg: "from-blue-950 to-blue-900",
      items: [
        "Drag-and-drop kanban boards for visual task management",
        "Custom task statuses to match your workflow",
        "Task dependencies and relationships",
        "Automated task assignments based on workload",
      ],
      image: {
        light: "/placeholder.svg?height=300&width=500",
        dark: "/placeholder.svg?height=300&width=500",
      },
    },
    {
      id: "team-collaboration",
      title: "Team Collaboration",
      description:
        "Work together seamlessly with real-time updates and communication tools.",
      icon: Users,
      color: "from-teal-500 to-teal-600 dark:from-teal-400 dark:to-teal-500",
      lightBg: "from-teal-50 to-teal-100",
      darkBg: "from-teal-950 to-teal-900",
      items: [
        "Real-time collaboration with live updates",
        "Team chat and task comments",
        "Role-based permissions and access control",
        "Activity feed to track all project changes",
      ],
      image: {
        light: "/placeholder.svg?height=300&width=500",
        dark: "/placeholder.svg?height=300&width=500",
      },
    },
    {
      id: "analytics",
      title: "Advanced Analytics",
      description: "Gain insights into project progress and team performance.",
      icon: BarChart3,
      color:
        "from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500",
      lightBg: "from-purple-50 to-purple-100",
      darkBg: "from-purple-950 to-purple-900",
      items: [
        "Comprehensive dashboards with key metrics",
        "Burndown charts and velocity tracking",
        "Team performance analytics",
        "Custom reports and data exports",
      ],
      image: {
        light: "/placeholder.svg?height=300&width=500",
        dark: "/placeholder.svg?height=300&width=500",
      },
    },
  ];

  const additionalFeatures = [
    {
      title: "Lightning Fast",
      description:
        "Optimized performance ensures TaskTrace responds instantly to your actions.",
      icon: Zap,
    },
    {
      title: "Enterprise Security",
      description:
        "Bank-level encryption and security protocols keep your data safe.",
      icon: Shield,
    },
    {
      title: "Global Access",
      description:
        "Access your projects from anywhere with our cloud-based platform.",
      icon: Globe,
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-[30%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-3xl"></div>
          <div className="absolute top-[60%] -right-[5%] w-[30%] h-[40%] rounded-full bg-teal-500/5 dark:bg-teal-500/10 blur-3xl"></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}>
          {/* Section header */}
          <motion.div
            variants={itemVariants}
            className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground text-sm font-medium">
              <span className="flex h-2 w-2 rounded-full bg-teal-500 mr-2"></span>
              Powerful Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to manage projects effectively
            </h2>
            <p className="text-xl text-muted-foreground">
              TaskTrace combines powerful features with an intuitive interface
              to help teams deliver projects on time.
            </p>
          </motion.div>

          {/* Feature tabs */}
          <motion.div variants={itemVariants} className="mb-16">
            <Tabs
              defaultValue={features[0].id}
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid grid-cols-3 md:grid-cols-3 bg-muted/50">
                  {features.map((feature) => (
                    <TabsTrigger
                      key={feature.id}
                      value={feature.id}
                      className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      <feature.icon className="w-5 h-5 mr-2" />
                      <span className="hidden sm:inline">{feature.title}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {features.map((feature) => (
                <TabsContent
                  key={feature.id}
                  value={feature.id}
                  className="focus-visible:outline-none focus-visible:ring-0">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <div
                        className={`inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br ${feature.lightBg} dark:${feature.darkBg} mb-6`}>
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white`}>
                          <feature.icon className="w-6 h-6" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-lg mb-6">
                        {feature.description}
                      </p>

                      <ul className="space-y-3 mb-8">
                        {feature.items.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      <Link href="/features">
                        <Button className="rounded-full">
                          Learn more about {feature.title.toLowerCase()}
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </div>

                    <div className="relative">
                      <div className="rounded-xl overflow-hidden shadow-xl border border-border">
                        <div className="aspect-[4/3] relative bg-muted">
                          {/* We'd use next/image here with proper images */}
                          <img
                            src={feature.image.light || "/placeholder.svg"}
                            alt={feature.title}
                            className="w-full h-full object-cover dark:hidden"
                          />
                          <img
                            src={feature.image.dark || "/placeholder.svg"}
                            alt={feature.title}
                            className="w-full h-full object-cover hidden dark:block"
                          />
                        </div>
                      </div>

                      {/* Decorative elements */}
                      <div
                        className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-xl bg-gradient-to-br ${feature.lightBg} dark:${feature.darkBg} -z-10`}></div>
                      <div
                        className={`absolute -top-6 -left-6 w-16 h-16 rounded-xl bg-gradient-to-br ${feature.lightBg} dark:${feature.darkBg} -z-10`}></div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>

          {/* Additional features */}
          <motion.div variants={itemVariants}>
            <div className="grid md:grid-cols-3 gap-8">
              {additionalFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            variants={itemVariants}
            className="mt-20 text-center bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-950/50 dark:to-teal-950/50 rounded-2xl p-8 md:p-12 border border-border/50">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to transform how your team works?
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of teams that use TaskTrace to deliver projects on
              time, every time.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 dark:from-blue-500 dark:to-teal-400 w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full w-full sm:w-auto">
                  View Pricing
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
