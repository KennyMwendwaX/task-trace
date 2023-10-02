"use client";

import { tasks } from "@/data/tasks";
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

interface StatusCounts {
  [key: string]: number;
}
interface StatusColors {
  [key: string]: string;
}

export default function TaskChart() {
  // Count the number of tasks for each status
  const statusCounts: StatusCounts = {};
  tasks.forEach((task) => {
    const status = task.status;
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  const statusColors: StatusColors = {
    done: "#16a34a",
    todo: "#2563eb",
    "in progress": "#9333ea",
    canceled: "#dc2626",
    backlog: "#4b5563",
  };

  // Convert the counts into an array of objects suitable for Recharts
  const statusChartData = Object.keys(statusCounts).map((status) => ({
    name: status,
    tasks: statusCounts[status],
    fill: statusColors[status],
  }));

  return (
    <>
      <div className="pt-5">
        <div
          className="rounded-lg border bg-card text-card-foreground shadow-sm"
          style={{ width: "40%", height: 400 }}>
          <div className="text-xl font-semibold leading-none tracking-tight p-2">
            Task Analytics Chart
          </div>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                dataKey="tasks"
                data={statusChartData}
                fill="#8884d8"
                label
                cx="50%"
                cy="40%"
                innerRadius={70}
                outerRadius={100}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend align="right" verticalAlign="middle" layout="vertical" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
