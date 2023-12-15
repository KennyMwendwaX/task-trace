"use client";

import { Task } from "@/lib/schema";
import { Card } from "@/components/ui/card";

type Props = {
  tasks: Task[];
};

export default function LatestTasks({ tasks }: Props) {
  return (
    <>
      <Card className="w-[800px]">
        <div className="text-xl font-semibold leading-none tracking-tight p-2">
          Latest Tasks
        </div>
      </Card>
    </>
  );
}
