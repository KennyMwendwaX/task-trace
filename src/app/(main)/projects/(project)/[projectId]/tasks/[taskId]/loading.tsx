import { Card } from "@/components/ui/card";
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
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
        <div>
          <Skeleton className="h-8 w-96 mb-2" />
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Skeleton className="rounded-full px-3 py-1.5 w-20 h-6" />
            <Skeleton className="rounded-full px-3 py-1.5 w-20 h-6" />
            <Skeleton className="rounded-full px-3 py-1.5 w-20 h-6" />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Skeleton className="px-12 py-4 rounded-md w-full sm:w-auto" />
          <Skeleton className="px-12 py-4 rounded-md w-full sm:w-auto" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3 lg:flex-wrap-reverse">
          <Skeleton className="rounded-full px-3 py-1.5 w-40 h-6" />
          <Skeleton className="rounded-full px-3 py-1.5 w-40 h-6" />
          <Skeleton className="rounded-full px-3 py-1.5 w-40 h-6" />
        </div>
      </div>
      <Card className="mt-4 p-4 sm:p-6">
        <Skeleton className="p-4 rounded-md h-[350px]" />
      </Card>
    </main>
  );
}
