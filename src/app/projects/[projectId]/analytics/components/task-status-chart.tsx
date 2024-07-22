"use client";

import { ProjectTask } from "@/lib/schema/TaskSchema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart, Sector, Label } from "recharts";
import { TbChartPieOff } from "react-icons/tb";
import { useState, useMemo, useEffect } from "react";
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

const statusText: Record<Status, string> = {
  DONE: "Done",
  TO_DO: "Todo",
  IN_PROGRESS: "In Progress",
  CANCELED: "Canceled",
};

const statusColors: Record<string, string> = {
  Done: "#16a34a",
  Todo: "#2563eb",
  "In Progress": "#ea580c",
  Canceled: "#dc2626",
};

const statusOrder = ["Done", "Todo", "In Progress", "Canceled"];

export default function TaskStatusChart({ tasks }: Props) {
  const statusChartData = useMemo(() => {
    const statusCounts = tasks.reduce((acc, task) => {
      const status = statusText[task.status];
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return statusOrder
      .filter((status) => statusCounts[status])
      .map((status) => ({
        status,
        tasks: statusCounts[status],
        fill: statusColors[status],
      }));
  }, [tasks]);

  const [activeStatus, setActiveStatus] = useState(() =>
    statusChartData.length > 0 ? statusChartData[0].status : "Done"
  );

  useEffect(() => {
    if (
      statusChartData.length > 0 &&
      !statusChartData.some((item) => item.status === activeStatus)
    ) {
      setActiveStatus(statusChartData[0].status);
    }
  }, [statusChartData, activeStatus]);

  const activeIndex = useMemo(
    () => statusChartData.findIndex((item) => item.status === activeStatus),
    [statusChartData, activeStatus]
  );

  const chartConfig: ChartConfig = {
    tasks: { label: "Tasks" },
    ...Object.fromEntries(
      Object.entries(statusColors).map(([status, color]) => [
        status.toLowerCase(),
        { label: status, color },
      ])
    ),
  };

  return (
    <Card className="w-full">
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
