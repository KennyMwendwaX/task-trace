import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectTask } from "@/lib/schema/TaskSchema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProjectRole } from "@/lib/config";
import { LuTrophy, LuMedal } from "react-icons/lu";

type Props = {
  tasks: ProjectTask[];
};

type MemberStats = {
  name: string;
  completedTasks: number;
  role: ProjectRole;
};

const roleColors = {
  OWNER: "bg-amber-500",
  ADMIN: "bg-indigo-500",
  MEMBER: "bg-emerald-500",
};

const rankIcons = [
  <LuTrophy key="trophy" className="text-yellow-500 w-8 h-8" />,
  <LuMedal key="silver" className="text-gray-400 w-7 h-7" />,
  <LuMedal key="bronze" className="text-amber-600 w-6 h-6" />,
];

export default function MemberLeaderboard({ tasks }: Props) {
  const memberStats = useMemo(() => {
    const stats: Record<string, MemberStats> = {};
    tasks.forEach((task) => {
      if (task.status === "DONE" && task.member && task.member.user) {
        const memberName = task.member.user.name;
        if (!stats[memberName]) {
          stats[memberName] = {
            name: memberName,
            completedTasks: 0,
            role: task.member.role,
          };
        }
        stats[memberName].completedTasks += 1;
      }
    });
    return Object.values(stats)
      .sort((a, b) => b.completedTasks - a.completedTasks)
      .slice(0, 5); // Top 5 members
  }, [tasks]);
  const maxTasks = Math.max(...memberStats.map((stat) => stat.completedTasks));

  return (
    <Card className="w-full">
      <CardHeader className="p-4 relative">
        <CardTitle className="text-xl font-bold tracking-tight relative z-10">
          Top Performers
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <ul className="space-y-2">
          {memberStats.map((stat, index) => (
            <li
              key={stat.name}
              className={`flex items-center space-x-3 p-2 rounded-md transition-all duration-300 ${
                index === 0
                  ? "bg-gradient-to-r from-yellow-50 to-yellow-300 shadow-sm"
                  : index === 1
                  ? "bg-gradient-to-r from-gray-50 to-gray-300"
                  : index === 2
                  ? "bg-gradient-to-r from-amber-50 to-amber-300"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  index < 3 ? "bg-white" : "bg-gray-200 text-gray-600"
                } font-bold text-sm`}>
                {index < 3 ? rankIcons[index] : index + 1}
              </div>
              <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="text-sm font-semibold bg-gray-200 text-gray-600">
                  {stat.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3
                    className={`text-base font-semibold ${
                      index === 0
                        ? "text-yellow-800"
                        : index === 1
                        ? "text-gray-800"
                        : index === 2
                        ? "text-amber-800"
                        : "text-gray-800"
                    }`}>
                    {stat.name}
                  </h3>
                  <Badge
                    variant="default"
                    className={`${
                      roleColors[stat.role]
                    } text-white px-2 py-0.5 rounded-full text-xs font-medium`}>
                    {stat.role}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress
                    value={(stat.completedTasks / maxTasks) * 100}
                    className={`h-1.5 flex-1 ${
                      index === 0
                        ? "bg-yellow-300"
                        : index === 1
                        ? "bg-gray-300"
                        : index === 2
                        ? "bg-amber-300"
                        : "bg-gray-200"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium whitespace-nowrap ${
                      index === 0
                        ? "text-yellow-800"
                        : index === 1
                        ? "text-gray-800"
                        : index === 2
                        ? "text-amber-800"
                        : "text-gray-600"
                    }`}>
                    {stat.completedTasks} tasks
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
