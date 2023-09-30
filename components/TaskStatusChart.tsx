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

export default function TaskStatusChart() {
  // Count the number of tasks for each status
  const statusCounts: StatusCounts = {};
  tasks.forEach((task) => {
    const status = task.status;
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  // Convert the counts into an array of objects suitable for Recharts
  const statusChartData = Object.keys(statusCounts).map((status) => ({
    status,
    count: statusCounts[status],
  }));
  return (
    <>
      <div>Task Chart according to status</div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={statusChartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
