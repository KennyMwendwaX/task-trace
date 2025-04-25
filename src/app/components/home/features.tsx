"use client";

import { motion } from "framer-motion";
import {
  CheckCircle,
  Users,
  BarChart3,
  ArrowRight,
  FolderKanban,
  ShieldCheck,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Features() {
  const features = [
    {
      title: "Task Management",
      description:
        "Create, assign, and track tasks with customizable labels, priorities, and statuses like Todo, In Progress, Done, and Canceled.",
      icon: CheckCircle,
    },
    {
      title: "Team Collaboration",
      description:
        "Invite members to your projects, assign roles, and stay aligned with shared progress and real-time updates.",
      icon: Users,
    },
    {
      title: "Project Control",
      description:
        "Manage public or private projects, control member access, and stay organized with project-level visibility.",
      icon: FolderKanban,
    },
    {
      title: "Visual Insights",
      description:
        "Monitor project health with dynamic stats: task completion rate, member count, and recent activity.",
      icon: BarChart3,
    },
    {
      title: "Secure Access",
      description:
        "Built-in user authentication, membership requests, and invitation codes ensure secure team access.",
      icon: ShieldCheck,
    },
    {
      title: "Seamless Onboarding",
      description:
        "Join projects easily via invitation codes or request access directly—streamlining team growth and collaboration.",
      icon: LogIn,
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

          {/* Features */}
          <motion.div variants={itemVariants}>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
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
              time, every time and with ease.
            </p>
            <Link href="/dashboard">
              <Button
                size="lg"
                className="rounded-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 dark:from-blue-500 dark:to-teal-400 w-full sm:w-auto">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
