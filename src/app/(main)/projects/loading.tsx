import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LuPin, LuShield, LuUsers } from "react-icons/lu";

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
    <Card className="overflow-hidden rounded-2xl border-0 bg-gray-50 dark:bg-gray-800/50">
      {/* Glass-morphism header */}
      <div className="relative p-6 pb-4">
        <div className="flex justify-between items-start relative">
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div className="min-w-0 flex-1">
              <Skeleton className="h-7 w-40 mb-1" />
              <div className="flex items-center mt-1">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-4 w-24 ml-3" />
              </div>
            </div>
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      {/* Card body */}
      <div className="px-6 pt-0 pb-6 bg-white dark:bg-gray-800 rounded-t-3xl -mt-2">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-5" />

        {/* Progress section */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-sm mb-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-16" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-2.5 w-full rounded-full" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>

        {/* Team members */}
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {[...Array(3)].map((_, index) => (
              <Skeleton
                key={index}
                className="w-8 h-8 rounded-xl border-2 border-white dark:border-gray-800"
              />
            ))}
            <Skeleton className="w-8 h-8 rounded-xl border-2 border-white dark:border-gray-800" />
          </div>
          <Skeleton className="h-5 w-24" />
        </div>

        {/* Action button */}
        <Skeleton className="mt-5 h-10 w-full rounded-xl" />
      </div>
    </Card>
  );
}
