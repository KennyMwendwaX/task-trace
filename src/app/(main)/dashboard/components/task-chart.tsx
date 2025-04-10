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
import { Status } from "@/lib/config";
import { useMemo } from "react";
import { Task } from "@/database/schema";

type Props = {
  tasks: Task[];
};

const statusText: Record<Status, string> = {
  DONE: "Done",
  TO_DO: "Todo",
  IN_PROGRESS: "In Progress",
  CANCELED: "Canceled",
};

const statusOrder = ["Done", "Todo", "In Progress", "Canceled"];

export default function TaskChart({ tasks }: Props) {
  const statusChartData = useMemo(() => {
    const initialCounts = statusOrder.reduce((acc, status) => {
      acc[status] = 0;
      return acc;
    }, {} as Record<string, number>);

    const statusCounts = tasks.reduce((acc, task) => {
      const status = statusText[task.status];
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, initialCounts);

    return statusOrder.map((status) => ({
      status,
      tasks: statusCounts[status],
    }));
  }, [tasks]);

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

  const maxTasks = Math.max(...statusChartData.map((item) => item.tasks));
  const yAxisMax = Math.max(maxTasks, 4);

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Tasks Overview</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 px-2">
          {tasks.length > 0 ? (
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
                  domain={[0, yAxisMax]}
                  allowDecimals={false}
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
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
              <TbChartBarOff className="h-8 w-8 mb-4" />
              <h3 className="font-semibold text-center">
                Tasks chart not available
              </h3>
              <p className="text-sm text-center">You do not have any tasks.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
