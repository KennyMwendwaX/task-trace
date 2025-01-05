import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-4 bg-muted/40 min-h-screen md:px-10 lg:px-14">
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="w-full h-10 rounded-lg sm:w-[200px] md:w-[400px]" />
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Skeleton className="w-1/2 md:w-40 h-10 rounded-md" />
          <Skeleton className="w-1/2 md:w-40 h-10 rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mt-4">
        {[...Array(6)].map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-2 relative">
              <div className="absolute top-2 right-2">
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <div className="flex items-center space-x-2 mt-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-24" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mt-2 mb-4" />
              <Skeleton className="h-4 w-5/6 mb-4" />
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-2 w-full" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, index) => (
                    <Skeleton key={index} className="w-8 h-8 rounded-full" />
                  ))}
                  <Skeleton className="w-8 h-8 rounded-full" />
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
