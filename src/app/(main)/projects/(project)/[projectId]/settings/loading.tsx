import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-10 w-48" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Project Visibility Card */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-56" />
                </div>
                <Skeleton className="h-6 w-12" />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone Card */}
          <Card className="border-red-300 shadow-sm">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              {[...Array(2)].map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 border-t">
                  <div className="mb-2 sm:mb-0 text-left">
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-9 w-32" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Project Invite Card */}
        <Card className="w-full h-fit">
          <CardHeader>
            <Skeleton className="h-6 w-36 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-4">
            <div className="bg-primary/10 rounded-lg p-4 text-center w-full">
              <Skeleton className="h-12 w-32 mx-auto mb-2" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </div>
          </CardContent>
          <div className="flex justify-between p-6">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </Card>
      </div>
    </main>
  );
}
