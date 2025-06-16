import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LuPin, LuShield, LuUsers } from "react-icons/lu";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-4 bg-muted/40 min-h-screen md:px-10 lg:px-14">
      <div className="flex flex-col space-y-6">
        {/* Search bar and Add Project button */}
        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 w-full">
            <Skeleton className="w-full h-9 rounded-lg" />
          </div>
          <Skeleton className="w-32 h-10 rounded-md" />
        </div>

        {/* Projects count indicator */}
        <div className="flex items-center text-sm text-muted-foreground">
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Owned Projects Section */}
        <div className="mt-6">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-5 h-5 text-muted-foreground">
              <LuPin className="w-6 h-6 text-primary/80" />
            </div>
            <span className="text-lg font-semibold ml-2">Owned Projects</span>
            <Badge variant="outline" className="ml-2 px-2 py-0 h-6 text-xs">
              <Skeleton className="h-3 w-4" />
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mt-4">
            {[...Array(3)].map((_, index) => (
              <ProjectCardSkeleton key={`owned-${index}`} />
            ))}
          </div>
        </div>

        {/* Admin Projects Section */}
        <div className="mt-6">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-5 h-5 text-muted-foreground">
              <LuShield className="w-6 h-6 text-amber-500/80" />
            </div>
            <span className="text-lg font-semibold ml-2">Admin Projects</span>
            <Badge variant="outline" className="ml-2 px-2 py-0 h-6 text-xs">
              <Skeleton className="h-3 w-4" />
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mt-4">
            {[...Array(3)].map((_, index) => (
              <ProjectCardSkeleton key={`admin-${index}`} />
            ))}
          </div>
        </div>

        {/* Member Projects Section */}
        <div className="mt-6">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-5 h-5 text-muted-foreground">
              <LuUsers className="w-6 h-6 text-emerald-500/80" />
            </div>
            <span className="text-lg font-semibold ml-2">Member Projects</span>
            <Badge variant="outline" className="ml-2 px-2 py-0 h-6 text-xs">
              <Skeleton className="h-3 w-4" />
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mt-4">
            {[...Array(3)].map((_, index) => (
              <ProjectCardSkeleton key={`member-${index}`} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function ProjectCardSkeleton() {
  return (
    <Card className="group h-full flex flex-col transition-all duration-300 overflow-hidden bg-gradient-to-br from-card to-card/80">
      <CardHeader className="pb-4 space-y-3">
        {/* Top row with status badges and menu */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Skeleton className="h-7 w-20 rounded-full" />
            <Skeleton className="h-7 w-16 rounded-full" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        {/* Title and description */}
        <div className="space-y-2">
          <Skeleton className="h-7 w-3/4" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>

        {/* Progress section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      </CardHeader>

      <CardContent className="pb-4 pt-0 space-y-4 flex-grow">
        <Separator className="opacity-30" />

        {/* Project stats - 3 column grid */}
        <div className="grid grid-cols-3 gap-2">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="rounded-lg p-3 border bg-gradient-to-br from-muted/50 to-muted/30">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted/50">
                  <Skeleton className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-4 w-8 mb-1" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Team members */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-10" />
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, index) => (
                <Skeleton
                  key={index}
                  className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-800"
                />
              ))}
              <Skeleton className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-800" />
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-4">
        <Skeleton className="w-full h-10 rounded-lg" />
      </CardFooter>
    </Card>
  );
}
