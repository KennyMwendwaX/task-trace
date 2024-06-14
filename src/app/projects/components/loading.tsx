import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <>
      <div className="flex items-center">
        <Skeleton className="h-9 w-[400px]" />

        <div className="ml-auto flex items-center gap-2">
          <Skeleton className="h-8 w-[132px]" />
          <Skeleton className="h-8 w-[132px]" />
        </div>
      </div>

      <Skeleton className="mt-5 h-7 w-[130px]" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mt-4">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8" />
              <div className="flex-1">
                <Skeleton className="h-8 w-2/3 mb-1" />
                <Skeleton className="h-6 w-1/4" />
              </div>
              <div className="ml-auto">
                <Skeleton className="w-8 h-8" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-1">
              <Skeleton className="w-1/4 h-3" />
              <Skeleton className="w-1/4 h-3" />
            </div>
            <Skeleton className="w-full h-5 mb-1" />
            <Skeleton className="w-1/2 h-3" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8" />
              <div className="flex-1">
                <Skeleton className="h-8 w-2/3 mb-1" />
                <Skeleton className="h-6 w-1/4" />
              </div>
              <div className="ml-auto">
                <Skeleton className="w-8 h-8" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-1">
              <Skeleton className="w-1/4 h-3" />
              <Skeleton className="w-1/4 h-3" />
            </div>
            <Skeleton className="w-full h-5 mb-1" />
            <Skeleton className="w-1/2 h-3" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8" />
              <div className="flex-1">
                <Skeleton className="h-8 w-2/3 mb-1" />
                <Skeleton className="h-6 w-1/4" />
              </div>
              <div className="ml-auto">
                <Skeleton className="w-8 h-8" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-1">
              <Skeleton className="w-1/4 h-3" />
              <Skeleton className="w-1/4 h-3" />
            </div>
            <Skeleton className="w-full h-5 mb-1" />
            <Skeleton className="w-1/2 h-3" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8" />
              <div className="flex-1">
                <Skeleton className="h-8 w-2/3 mb-1" />
                <Skeleton className="h-6 w-1/4" />
              </div>
              <div className="ml-auto">
                <Skeleton className="w-8 h-8" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-1">
              <Skeleton className="w-1/4 h-3" />
              <Skeleton className="w-1/4 h-3" />
            </div>
            <Skeleton className="w-full h-5 mb-1" />
            <Skeleton className="w-1/2 h-3" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8" />
              <div className="flex-1">
                <Skeleton className="h-8 w-2/3 mb-1" />
                <Skeleton className="h-6 w-1/4" />
              </div>
              <div className="ml-auto">
                <Skeleton className="w-8 h-8" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-1">
              <Skeleton className="w-1/4 h-3" />
              <Skeleton className="w-1/4 h-3" />
            </div>
            <Skeleton className="w-full h-5 mb-1" />
            <Skeleton className="w-1/2 h-3" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8" />
              <div className="flex-1">
                <Skeleton className="h-8 w-2/3 mb-1" />
                <Skeleton className="h-6 w-1/4" />
              </div>
              <div className="ml-auto">
                <Skeleton className="w-8 h-8" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-1">
              <Skeleton className="w-1/4 h-3" />
              <Skeleton className="w-1/4 h-3" />
            </div>
            <Skeleton className="w-full h-5 mb-1" />
            <Skeleton className="w-1/2 h-3" />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
