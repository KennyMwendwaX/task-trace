"use client";

import { Task } from "@/lib/schema";
import { Card } from "@/components/ui/card";
import format from "date-fns/format";

type Props = {
  tasks: Task[];
};

export default function LatestTasks({ tasks }: Props) {
  const latestTasks = tasks
    .map((task) => ({
      ...task,
      due_date: new Date(task.due_date),
      createdAt: new Date(task.createdAt),
    }))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <>
      <Card className="w-[800px]">
        <div className="text-xl font-semibold leading-none tracking-tight p-2">
          Latest Tasks
        </div>

        {latestTasks.length > 0 ? (
          <div className="relative overflow-x-auto pt-2 pb-1">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Task
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Due Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Priority
                  </th>
                </tr>
              </thead>
              <tbody>
                {latestTasks.map((task, index) => (
                  <tr
                    key={task.id}
                    className={`bg-white ${
                      index === latestTasks.length - 1 ? "" : "border-b"
                    }`}>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {task.name}
                    </th>
                    <td className="px-6 py-4">
                      {format(task.due_date, "dd/MM/yyyy")}
                    </td>
                    <td className="px-6 py-4">{task.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-48 flex justify-center">No tasks available</div>
        )}
      </Card>
    </>
  );
}
