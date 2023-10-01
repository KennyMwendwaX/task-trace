"use client";

import { Task } from "@/data/schema";
import { tasks } from "@/data/tasks";
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
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
        <div className="custom-tooltip">
          <p className="label">{`${payload[0].name}: ${payload[0].value} tasks`}</p>
        </div>
      );
    }

    return null;
  };

  const data = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
  ];
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
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
      <div>Hi</div>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              dataKey="tasks"
              data={statusChartData}
              fill="#8884d8"
              label
              labelLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <PieChart width={800} height={400}>
        <Pie
          data={statusChartData}
          cx={120}
          cy={200}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="tasks"
          label>
          <Tooltip />
          {/* {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))} */}
        </Pie>
      </PieChart>
    </>
  );
}
