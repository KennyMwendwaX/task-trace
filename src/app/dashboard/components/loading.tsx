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
      <div className="flex items-center">
        <Skeleton className="h-9 w-[600px]" />

        <div className="ml-auto flex items-center gap-2">
          <Skeleton className="h-9 w-[150px]" />
          <Skeleton className="h-9 w-[150px]" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
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
            <Skeleton className="h-8 w-[180px]" />
          </CardHeader>

          <CardContent className="grid gap-4">
            <Skeleton className="h-[350px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <Skeleton className="h-8 w-[180px]" />
              <Skeleton className="h-4 w-[300px]" />
            </div>
            <Skeleton className="h-9 w-[150px] ml-auto gap-1" />
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
