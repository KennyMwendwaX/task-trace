import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16 hidden md:block" />
          <div className="hidden md:block">
            <Skeleton className="h-4 w-4" />
          </div>
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Card>
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-start justify-between gap-4 lg:gap-6">
            <div className="w-full lg:w-7/12">
              <Skeleton className="h-7 w-48 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="flex flex-col w-full lg:w-auto gap-3">
              <div className="flex justify-between gap-2">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-28 rounded-full" />
              </div>
              <Skeleton className="h-14 w-full rounded-full" />
              <Skeleton className="h-8 w-full rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="bg-gray-100 border-none shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                  </div>
                  <Skeleton className="h-8 w-12" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Card>
      <div className="w-full grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center">
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="pt-2 px-6">
            <Skeleton className="h-[350px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-9 w-24" />
            </div>
            <Skeleton className="h-4 w-48 mt-1" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...Array(6)].map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
