import { Card, CardContent } from "@/components/ui/card";
import { Member } from "@/lib/schema/MemberSchema";
import { ProjectTask } from "@/lib/schema/TaskSchema";
import { LuUsers, LuCalendar, LuUser2, LuCheckSquare } from "react-icons/lu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CheckCircledIcon,
  CircleIcon,
  StopwatchIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";

type Props = {
  tasks: ProjectTask[];
  members: Member[];
};

export default function ProjectOverview({ tasks, members }: Props) {
  const totalTasks = tasks.length;
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
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-start justify-between gap-4 lg:gap-6">
          <div className="w-full lg:w-7/12">
            <h2 className="text-xl font-bold text-gray-800">
              Project Overview
            </h2>
            <p className="text-gray-600 mt-1">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
              quas laudantium facere. Quae, modi dolores. Perferendis ut neque
              nemo cumque consequuntur autem.
            </p>
          </div>
          <div className="flex flex-col w-full lg:w-auto gap-3">
            <div className="flex justify-between gap-2">
              <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5">
                <LuCheckSquare className="w-4 h-4 text-gray-600 mr-2" />
                <span className="text-sm font-semibold text-gray-800">
                  {totalTasks} Tasks
                </span>
              </div>
              <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5">
                <LuUsers className="w-4 h-4 text-gray-600 mr-2" />
                <span className="text-sm font-semibold text-gray-800">
                  {members.length} Members
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2">
              <Avatar className="w-10 h-10 bg-white">
                <AvatarImage src={""} />
                <AvatarFallback className="bg-white">
                  <LuUser2 className="w-5 h-5 text-gray-600" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs text-gray-500">Owner</p>
                <p className="text-sm font-semibold text-gray-800">
                  Johnny Billionz
                </p>
              </div>
            </div>
            <div className="flex items-center text-gray-600 bg-gray-100 rounded-full px-3 py-1.5">
              <LuCalendar className="w-4 h-4 mr-2" />
              <span className="text-sm font-semibold text-gray-800">
                Updated: 2024-07-06
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cardData.map((item, index) => (
            <Card key={index} className="bg-gray-100 border-none shadow-sm">
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
