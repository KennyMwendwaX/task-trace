import { Card, CardContent } from "@/components/ui/card";
import { Member } from "@/lib/schema/MemberSchema";
import { Project } from "@/lib/schema/ProjectSchema";
import { ProjectTask } from "@/lib/schema/TaskSchema";
import {
  LuUsers,
  LuCalendar,
  LuUser,
} from "react-icons/lu";
import {
  CheckCircledIcon,
  CircleIcon,
  StopwatchIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";

type Props = {
  project: Project;
  tasks: ProjectTask[];
  members: Member[];
};

export default function ProjectOverview({ project, tasks, members }: Props) {
  const tasksDone = tasks.filter((task) => task.status === "DONE").length;
  const tasksTodo = tasks.filter((task) => task.status === "TO_DO").length;
  const tasksInProgress = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;
  const tasksCanceled = tasks.filter(
    (task) => task.status === "CANCELED"
  ).length;

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
      <div className="p-6 space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-start justify-between">
          <div className="mb-4 lg:mb-0 lg:w-9/12 lg:pr-8">
            <h2 className="text-xl font-bold text-gray-800">
              Project Overview
            </h2>
            <p className="text-gray-600 mt-1">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
              quas laudantium facere. Quae, modi dolores. Perferendis ut neque
              nemo cumque consequuntur autem. Ipsam fugit consequatur
              repudiandae iste impedit doloribus iusto provident deleniti omnis,
              aliquam perferendis minima doloremque architecto expedita veniam
              molestias pariatur.
            </p>
          </div>
          <div className="flex flex-col justify-between lg:justify-start items-start lg:items-end space-y-3 w-full lg:w-auto">
            <div className="flex items-center space-x-4 w-full justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-gray-200 rounded-full p-2">
                  <LuUser className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Owner</p>
                  <p className="text-sm font-bold text-gray-800">
                    Johnny Billionz
                  </p>
                </div>
              </div>
              <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                <LuUsers className="w-4 h-4 text-gray-600 mr-2" />
                <span className="text-sm font-bold text-gray-800">12</span>
              </div>
            </div>
            <div className="flex items-center text-gray-600 bg-gray-100 rounded-full px-3 py-1 w-full lg:w-auto justify-center lg:justify-start">
              <LuCalendar className="w-4 h-4 mr-2" />
              <span className="text-sm">Last updated: 2024-07-06</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cardData.map((item, index) => (
            <Card key={index} className="bg-gray-50 border-none shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    {item.title}
                  </span>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {item.count}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
}
