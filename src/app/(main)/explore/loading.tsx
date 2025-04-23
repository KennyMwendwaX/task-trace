import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LuFolders } from "react-icons/lu";

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
          <Card key={index} className="overflow-hidden rounded-2xl border">
            <div className="p-6">
              {/* Header with project name and icon */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <Skeleton className="h-6 w-40 mb-2" />
                    <div className="flex items-center gap-2 mt-1">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                  </div>
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>

              {/* Description */}
              <div className="mt-4 mb-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mt-2" />
              </div>

              {/* Stats bar */}
              <div className="flex items-center gap-4 py-2">
                <div className="flex items-center gap-1.5">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-6" />
                </div>
                <div className="w-px h-4"></div>
                <div className="flex items-center gap-1.5">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="w-px h-4"></div>
                <div className="flex items-center gap-1.5">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t my-4"></div>

              {/* Footer with Team & Action */}
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton
                      key={i}
                      className="w-8 h-8 rounded-full border-2"
                    />
                  ))}
                </div>
                <Skeleton className="h-9 w-32 rounded-full" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
