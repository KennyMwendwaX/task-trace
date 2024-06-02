import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { LuArrowUpRight } from "react-icons/lu";

export default function Loading() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="h-[138px] px-4">
          <Skeleton className="h-6 w-full mt-5" />
          <Skeleton className="h-8 w-[60px] mt-3" />
          <Skeleton className="h-4 w-[180px] mt-3" />
        </Card>
        <Card className="h-[138px] px-4">
          <Skeleton className="h-6 w-full mt-5" />
          <Skeleton className="h-8 w-[60px] mt-3" />
          <Skeleton className="h-4 w-[180px] mt-3" />
        </Card>
        <Card className="h-[138px] px-4">
          <Skeleton className="h-6 w-full mt-5" />
          <Skeleton className="h-8 w-[60px] mt-3" />
          <Skeleton className="h-4 w-[180px] mt-3" />
        </Card>
        <Card className="h-[138px] px-4">
          <Skeleton className="h-6 w-full mt-5" />
          <Skeleton className="h-8 w-[60px] mt-3" />
          <Skeleton className="h-4 w-[180px] mt-3" />
        </Card>
      </div>

      <div className="grid gap-4 md:gap-4 lg:grid-cols-2 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center">
            <CardTitle className="text-xl">Task Overview</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Skeleton className="h-[350px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle className="text-xl">Recent Tasks</CardTitle>
              <CardDescription>
                Recent tasks assigned to you from your projects.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/tasks">
                View All
                <LuArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6 mt-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-[200px]" />
            </div>
            <div className="flex items-center gap-6 mt-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-[200px]" />
            </div>
            <div className="flex items-center gap-6 mt-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-[200px]" />
            </div>
            <div className="flex items-center gap-6 mt-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-[200px]" />
            </div>
            <div className="flex items-center gap-6 mt-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-[200px]" />
            </div>
            <div className="flex items-center gap-6 mt-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-[200px]" />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
