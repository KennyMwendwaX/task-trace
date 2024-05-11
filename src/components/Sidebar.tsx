"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LuHome, LuLineChart, LuUsers } from "react-icons/lu";
import { RxDashboard } from "react-icons/rx";
import { GoTasklist } from "react-icons/go";
import { useParams } from "next/navigation";

export default function Sidebar() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  return (
    <>
      <div className="fixed top-0 left-0 w-[260px] h-full border-r bg-muted/40 hidden lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex-1 mt-[72px]">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:text-primary">
                <LuHome className="h-4 w-4" />
                Dashboard
              </Link>
              {/* Arrow Home*/}
              <Link
                href={`/projects/${projectId}`}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:text-primary">
                <RxDashboard className="h-4 w-4" />
                Overview
              </Link>
              <Link
                href={`/projects/${projectId}/tasks`}
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2.5 text-primary transition-all hover:text-primary">
                <GoTasklist className="h-5 w-5" />
                Tasks
              </Link>
              <Link
                href={`/projects/${projectId}/members`}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:text-primary">
                <LuUsers className="h-4 w-4" />
                Members
              </Link>
              <Link
                href={`/projects/${projectId}/analytics`}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:text-primary">
                <LuLineChart className="h-4 w-4" />
                Analytics
              </Link>
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Card x-chunk="dashboard-02-chunk-0">
              <CardHeader className="p-4 pt-0">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
