"use client";

import { ProjectTask } from "@/lib/schema/TaskSchema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart, Sector, Label } from "recharts";
import { TbChartPieOff } from "react-icons/tb";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Status } from "@/lib/config";

type Props = {
  tasks: ProjectTask[];
};

type StatusCounts = {
  [key: string]: number;
};

export default function TaskStatusChart({ tasks }: Props) {
  const statusText: Record<Status, string> = React.useMemo(
    () => ({
      DONE: "Done",
      TO_DO: "Todo",
      IN_PROGRESS: "In Progress",
      CANCELED: "Canceled",
    }),
    []
  );

  const statusColors = React.useMemo(
    () => ({
      [statusText.DONE]: "#16a34a",
      [statusText.TO_DO]: "#2563eb",
      [statusText.IN_PROGRESS]: "#ea580c",
      [statusText.CANCELED]: "#dc2626",
    }),
    [statusText]
  );

  const statusChartData = React.useMemo(() => {
    const statusCounts: StatusCounts = {};
    tasks.forEach((task) => {
      const status = statusText[task.status];
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    return Object.keys(statusCounts).map((status) => ({
      status,
      tasks: statusCounts[status],
      fill: statusColors[status],
    }));
  }, [tasks, statusText, statusColors]);

  const [activeStatus, setActiveStatus] = React.useState(
    statusChartData[0]?.status || ""
  );

  React.useEffect(() => {
    if (
      statusChartData.length > 0 &&
      !statusChartData.some((item) => item.status === activeStatus)
    ) {
      setActiveStatus(statusChartData[0].status);
    }
  }, [statusChartData, activeStatus]);

  const activeIndex = React.useMemo(
    () => statusChartData.findIndex((item) => item.status === activeStatus),
    [statusChartData, activeStatus]
  );

  const chartConfig = React.useMemo(
    () => ({
      tasks: {
        label: "Tasks",
      },
      ...Object.fromEntries(
        Object.entries(statusColors).map(([status, color]) => [
          status.toLowerCase(),
          { label: status, color },
        ])
      ),
    }),
    [statusColors]
  ) satisfies ChartConfig;

  const id = "task-pie-chart";

  return (
    <Card data-chart={id}>
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex flex-row items-center justify-between pb-0">
        <CardTitle className="text-xl">Tasks status Chart</CardTitle>
        {statusChartData.length > 0 && (
          <Select value={activeStatus} onValueChange={setActiveStatus}>
            <SelectTrigger
              className="h-7 w-[130px] rounded-lg pl-2.5"
              aria-label="Select a status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent align="end" className="rounded-xl">
              {statusChartData.map(({ status }) => (
                <SelectItem
                  key={status}
                  value={status}
                  className="rounded-lg [&_span]:flex">
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-sm"
                      style={{ backgroundColor: statusColors[status] }}
                    />
                    {status}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        {statusChartData.length === 0 ? (
          <div className="mx-auto flex flex-col items-center justify-center text-center py-16">
            <TbChartPieOff className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold">
              Tasks chart not available
            </h3>
            <p className="mb-4 mt-2 text-base text-muted-foreground">
              There are no tasks in the project.
            </p>
          </div>
        ) : (
          <ChartContainer
            id={id}
            config={chartConfig}
            className="mx-auto aspect-square w-full max-w-[300px]">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={statusChartData}
                dataKey="tasks"
                nameKey="status"
                innerRadius={60}
                strokeWidth={5}
                activeIndex={activeIndex}
                activeShape={({ outerRadius = 0, ...props }) => (
                  <g>
                    <Sector {...props} outerRadius={outerRadius + 10} />
                    <Sector
                      {...props}
                      outerRadius={outerRadius + 25}
                      innerRadius={outerRadius + 12}
                    />
                  </g>
                )}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle">
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold">
                            {statusChartData[
                              activeIndex
                            ]?.tasks.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground">
                            Tasks
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
