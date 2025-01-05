import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="h-[138px] px-4">
            <Skeleton className="h-6 w-full mt-5" />
            <Skeleton className="h-8 w-[60px] mt-3" />
            <Skeleton className="h-4 w-[180px] mt-3" />
          </Card>
        ))}
      </div>

      <div className="w-full grid grid-cols-1 gap-4 mt-6 md:grid-cols-2">
        <Skeleton className="h-[300px] rounded" />
        <Skeleton className="h-[300px] rounded" />
      </div>
    </>
  );
}
