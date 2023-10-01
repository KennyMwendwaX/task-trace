"use client";

import { tasks } from "@/data/tasks";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

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
    status,
    tasks: statusCounts[status],
    fill: statusColors[status],
  }));
  return (
    <>
      <div>Task Chart according to status</div>
      <ResponsiveContainer width="35%" height={300}>
        <BarChart
          data={statusChartData}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 5,
          }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="tasks" fill="#8884d8" barSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
