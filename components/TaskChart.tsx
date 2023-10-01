"use client";

import { tasks } from "@/data/tasks";
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
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
import { TooltipType } from "recharts/types/util/types";

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
      <div>Tasks Analytics</div>
      <ResponsiveContainer width="35%" height={300}>
        <BarChart data={statusChartData}>
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="tasks" fill="#8884d8" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="35%" height={350}>
        <BarChart data={statusChartData}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={13}
            tickLine={false}
          />
          <YAxis stroke="#888888" fontSize={12} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="tasks" fill="#adfa1d" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div>Hi</div>
      <div
        className="border border-slate-800 rounded-lg"
        style={{ width: "35%", height: 350 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              dataKey="tasks"
              data={statusChartData}
              fill="#8884d8"
              label
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
