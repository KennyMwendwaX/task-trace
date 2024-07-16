"use client";

import { UserTask } from "@/lib/schema/TaskSchema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { TbChartBarOff } from "react-icons/tb";

type Props = {
  tasks: UserTask[];
};

type StatusCounts = {
  [key: string]: number;
};

export default function TaskChart({ tasks }: Props) {
  // Count the number of tasks for each status
  const statusCounts: StatusCounts = {};
  tasks.forEach((task) => {
    const status = task.status;
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  const statusText: Record<string, string> = {
    DONE: "Done",
    TO_DO: "Todo",
    IN_PROGRESS: "In Progress",
    CANCELED: "Canceled",
  };

  // Convert the counts into an array of objects suitable for Recharts
  let statusChartData = Object.keys(statusCounts).map((status) => ({
    status: statusText[status],
    tasks: statusCounts[status],
  }));

  // Order of statuses
  const statusOrder = ["Done", "Todo", "In Progress", "Canceled"];

  // Sort the statusChartData based on the desired order
  statusChartData = statusChartData.sort(
    (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
  );

  const chartConfig = {
    tasks: {
      label: "Tasks",
      color: "hsl(var(--primary))",
    },
    status: {
      label: "Status",
      color: "hsl(var(--muted-foreground))",
    },
  } satisfies ChartConfig;

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Tasks Overview</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 px-2">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
              <TbChartBarOff className="h-8 w-8 mb-4" />
              <h3 className="font-semibold text-center">
                Tasks chart not available
              </h3>
              <p className="text-sm text-center">You do not have any tasks.</p>
            </div>
          ) : (
            <ChartContainer
              config={chartConfig}
              className="min-h-[350px] w-full">
              <BarChart accessibilityLayer data={statusChartData}>
                <XAxis
                  dataKey="status"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="tasks"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </>
  );
}
