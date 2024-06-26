"use client";

import { ProjectTask } from "@/lib/schema/TaskSchema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  Legend,
  TooltipProps,
  BarChart,
  XAxis,
  YAxis,
  Bar,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { TbChartBarOff } from "react-icons/tb";

type Props = {
  tasks: ProjectTask[];
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
    Status: statusText[status],
    Tasks: statusCounts[status],
  }));

  // Order of statuses
  const statusOrder = ["Done", "Todo", "In Progress", "Canceled"];

  // Sort the statusChartData based on the desired order
  statusChartData = statusChartData.sort(
    (a, b) => statusOrder.indexOf(a.Status) - statusOrder.indexOf(b.Status)
  );

  const CustomTooltip = ({
    active,
    payload,
  }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-900 p-3">
          <div className="">{`${payload[0].name}`}</div>
          <div className="text-purple-600">{`Tasks: ${payload[0].value}`}</div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="text-xl">Tasks Analytics Chart</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {tasks.length === 0 ? (
            <div className="mx-auto flex flex-col items-center justify-center text-center py-16">
              <TbChartBarOff className="h-12 w-12 text-muted-foreground" />

              <h3 className="mt-4 text-xl font-semibold">
                Tasks chart not available
              </h3>
              <p className="mb-4 mt-2 text-base text-muted-foreground">
                There are no tasks in the project.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={statusChartData}>
                <XAxis
                  dataKey="Status"
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
                <Bar
                  dataKey="Tasks"
                  fill="currentColor"
                  radius={[4, 4, 0, 0]}
                  className="fill-primary"
                />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </>
  );
}
