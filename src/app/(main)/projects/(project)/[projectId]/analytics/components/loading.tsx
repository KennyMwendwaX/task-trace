import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <Skeleton className="h-8 w-40 mb-4" />
      <div className="w-full grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-36 mb-4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="pt-2 px-6">
            <Skeleton className="h-[250px] w-full" />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
