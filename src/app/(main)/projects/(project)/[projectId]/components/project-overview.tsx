import { Card, CardContent } from "@/components/ui/card";
import { LuUsers, LuCalendar, LuUser2, LuCheckSquare } from "react-icons/lu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CheckCircledIcon,
  CircleIcon,
  StopwatchIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";
import { format } from "date-fns";
import React from "react";
import { DetailedProject, Member, Task } from "@/server/database/schema";

type Props = {
  project: DetailedProject;
  tasks: Task[];
  members: Member[];
};

const ProjectOverview = React.memo(function ProjectOverview({
  project,
  tasks,
  members,
}: Props) {
  const totalTasks = tasks.length;
  const tasksDone = tasks.filter((task) => task.status === "DONE").length;
  const tasksTodo = tasks.filter((task) => task.status === "TO_DO").length;
  const tasksInProgress = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;
  const tasksCanceled = tasks.filter(
    (task) => task.status === "CANCELED"
  ).length;

  const createdAt = format(project.createdAt, "MMM d, yyyy");
  const updatedAt = project.updatedAt
    ? format(project.updatedAt, "MMM d, yyyy")
    : null;

  const cardData = [
    {
      title: "Done",
      icon: CheckCircledIcon,
      color: "text-green-500",
      count: tasksDone,
    },
    {
      title: "Todo",
      icon: CircleIcon,
      color: "text-blue-500",
      count: tasksTodo,
    },
    {
      title: "In Progress",
      icon: StopwatchIcon,
      color: "text-orange-500",
      count: tasksInProgress,
    },
    {
      title: "Canceled",
      icon: CrossCircledIcon,
      color: "text-red-500",
      count: tasksCanceled,
    },
  ];

  return (
    <Card className="rounded-xl overflow-hidden">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-start justify-between gap-4 lg:gap-6">
          <div className="w-full lg:w-7/12">
            <h2 className="text-xl font-bold">Project Overview</h2>
            <p className="mt-1">{project.description}</p>
          </div>
          <div className="flex flex-col w-full lg:w-auto gap-3">
            <div className="flex justify-between gap-2">
              <Card className="flex items-center shadow-none rounded-full px-3 py-1.5">
                <LuCheckSquare className="w-4 h-4 mr-2" />
                <span className="text-sm font-semibold">
                  {totalTasks} Tasks
                </span>
              </Card>
              <Card className="flex items-center shadow-none rounded-full px-3 py-1.5">
                <LuUsers className="w-4 h-4 mr-2" />
                <span className="text-sm font-semibold">
                  {members.length} Members
                </span>
              </Card>
            </div>
            <Card className="flex items-center gap-3 shadow-none rounded-full px-4 py-2">
              <Avatar className="w-10 h-10">
                <AvatarImage src={""} />
                <AvatarFallback>
                  <LuUser2 className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs">Owner</p>
                <p className="text-sm font-semibold">{project.owner.name}</p>
              </div>
            </Card>

            <Card className="flex items-center shadow-none rounded-full px-3 py-1.5">
              <LuCalendar className="w-4 h-4 mr-2" />
              <span className="text-sm font-semibold">
                Created: {createdAt}
              </span>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cardData.map((item, index) => (
            <Card className="shadow-none" key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{item.title}</span>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="text-2xl font-bold">{item.count}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
});

export default ProjectOverview;
