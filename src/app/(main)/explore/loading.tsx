import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LuFolders } from "react-icons/lu";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-4 bg-muted/40 min-h-screen md:px-10 lg:px-14">
      {/* Search and filter area */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-auto sm:flex-grow">
          <Skeleton className="w-full h-10 rounded-lg" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="w-32 h-10 rounded-md" />
          <Skeleton className="w-32 h-10 rounded-md" />
        </div>
      </div>

      {/* Projects header */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-2">
          <LuFolders className="w-6 h-6 text-primary/80" />
          <span className="text-xl font-semibold">Explore Projects</span>
          <Badge variant="outline" className="ml-1 px-2 py-0 h-6 text-xs">
            Loading...
          </Badge>
        </div>
      </div>

      {/* Projects grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mt-4">
        {[...Array(6)].map((_, index) => (
          <Card className="group h-full flex flex-col transition-all duration-300 overflow-hidden bg-gradient-to-br from-card to-card/80">
            <CardHeader className="pb-4 space-y-3">
              {/* Top row with status badges and bookmark */}
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

              {/* Progress section (conditional) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-8" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            </CardHeader>

            <CardContent className="pb-4 pt-0 space-y-4 flex-grow">
              <Separator className="opacity-30" />

              {/* Project stats - 3 column grid with colored backgrounds */}
              <div className="grid grid-cols-3 gap-2">
                {/* Members stat */}
                <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 p-3 border border-blue-100 dark:border-blue-900/30">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10">
                      <Skeleton className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Skeleton className="h-4 w-8 mb-1" />
                      <Skeleton className="h-3 w-14" />
                    </div>
                  </div>
                </div>

                {/* Tasks stat */}
                <div className="rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 p-3 border border-emerald-100 dark:border-emerald-900/30">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10">
                      <Skeleton className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Skeleton className="h-4 w-12 mb-1" />
                      <Skeleton className="h-3 w-10" />
                    </div>
                  </div>
                </div>

                {/* Created stat */}
                <div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 p-3 border border-purple-100 dark:border-purple-900/30">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/10">
                      <Skeleton className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Skeleton className="h-4 w-10 mb-1" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                </div>
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
        ))}
      </div>
    </main>
  );
}
