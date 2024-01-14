"use client";

import { Task } from "@/lib/schema/TaskSchema";
import React from "react";
import {
  ResponsiveContainer,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  TooltipProps,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

interface Props {
  tasks: Task[];
}

interface StatusCounts {
  [key: string]: number;
}
interface StatusColors {
  [key: string]: string;
}

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

  const statusColors: StatusColors = {
    DONE: "#16a34a",
    TO_DO: "#2563eb",
    IN_PROGRESS: "#FFA500CC",
    CANCELED: "#dc2626",
  };

  // Convert the counts into an array of objects suitable for Recharts
  const statusChartData = Object.keys(statusCounts).map((status) => ({
    name: statusText[status],
    tasks: statusCounts[status],
    fill: statusColors[status],
  }));

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
      <div
        className="rounded-lg border bg-card text-card-foreground shadow-sm"
        style={{ width: "40%", height: 412 }}>
        <div className="text-xl font-semibold leading-none tracking-tight p-2">
          Task Analytics Chart
        </div>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              dataKey="tasks"
              data={statusChartData}
              fill="#8884d8"
              cx="50%"
              cy="40%"
              innerRadius={70}
              outerRadius={100}
            />
            <Tooltip />
            <Legend align="center" layout="centric" />
            {/* <Legend align="right" verticalAlign="middle" layout="vertical" /> */}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
