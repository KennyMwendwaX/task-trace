import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectTask } from "@/lib/schema/TaskSchema";

type Props = {
  tasks: ProjectTask[];
};

type MemberStats = {
  name: string;
  completedTasks: number;
  role: "OWNER" | "ADMIN" | "MEMBER";
};

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
    <Card>
      <CardHeader>
        <CardTitle>Member Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {memberStats.map((stat, index) => (
            <li key={stat.name} className="flex items-center">
              <span className="w-6 font-bold">{index + 1}.</span>
              <span className="w-32 truncate">{stat.name}</span>
              <span className="w-16 text-xs text-gray-500">{stat.role}</span>
              <div className="flex-1 h-5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600"
                  style={{
                    width: `${(stat.completedTasks / maxTasks) * 100}%`,
                  }}
                />
              </div>
              <span className="ml-2 font-semibold">{stat.completedTasks}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
