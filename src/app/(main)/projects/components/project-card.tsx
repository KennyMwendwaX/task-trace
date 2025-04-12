import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LuMoreVertical,
  LuCalendar,
  LuCheckCircle2,
  LuUsers,
  LuClock,
  LuClipboard,
  LuTrash2,
  LuChevronRight,
} from "react-icons/lu";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { MemberProject } from "@/database/schema";
import { ProjectStatus } from "@/lib/config";

type Props = {
  project: MemberProject;
};

export default function ProjectCard({ project }: Props) {
  const getStatusConfig = (status: ProjectStatus) => {
    switch (status) {
      case "BUILDING":
        return {
          color: "bg-gradient-to-r from-emerald-500 to-teal-500",
          textColor: "text-white",
        };
      case "LIVE":
        return {
          color: "bg-gradient-to-r from-blue-500 to-indigo-500",
          textColor: "text-white",
        };
      default:
        return {
          color: "bg-gradient-to-r from-gray-500 to-slate-500",
          textColor: "text-white",
        };
    }
  };

  const statusConfig = getStatusConfig(project.status);
  const createdAt = format(project.createdAt, "MMM d, yyyy");

  const hasNoTasks = project.totalTasksCount === 0;
  const progressPercentage = hasNoTasks
    ? 0
    : (project.completedTasksCount / project.totalTasksCount) * 100;

  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return "bg-emerald-500";
    if (percentage >= 40) return "bg-blue-500";
    return "bg-amber-500";
  };

  return (
    <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className={`h-1.5 w-full ${statusConfig.color}`}></div>
      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-start">
          <Link href={`/projects/${project.id}`} className="block group">
            <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
              {project.name}
            </CardTitle>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full opacity-70 hover:opacity-100 hover:bg-gray-100">
                <LuMoreVertical className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="cursor-pointer">
                <LuCheckCircle2 className="mr-2 h-4 w-4" /> Pin Project
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <LuClipboard className="mr-2 h-4 w-4" /> Edit Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50">
                <LuTrash2 className="mr-2 h-4 w-4" /> Move to Trash
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center flex-wrap gap-2 mt-3">
          <Badge
            className={`${statusConfig.color} ${statusConfig.textColor} border-0 rounded-full text-xs py-1 px-3 shadow-sm`}>
            {project.status}
          </Badge>
          <Badge
            variant="outline"
            className="py-1 px-2 rounded-lg text-xs bg-gray-50 text-gray-700 border-gray-200">
            <LuUsers className="mr-1 h-3 w-3" /> {project.memberCount}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 mt-2 mb-4 line-clamp-2">
          {project.description}
        </p>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-gray-700">Progress</span>
            <span className="text-gray-600 font-medium">
              {hasNoTasks
                ? "No tasks"
                : `${project.completedTasksCount}/${project.totalTasksCount}`}
            </span>
          </div>

          {!hasNoTasks ? (
            <div className="space-y-3">
              <Progress
                value={progressPercentage}
                className={`h-2 ${getProgressColor(progressPercentage)}`}
                aria-label={`${progressPercentage.toFixed(0)}% complete`}
              />
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <LuCalendar className="h-3 w-3" />
                  <span>Updated 3 days ago</span>
                </div>
                <span className="font-semibold text-gray-700">
                  {progressPercentage.toFixed(0)}% Complete
                </span>
              </div>
            </div>
          ) : (
            <div className="py-3 px-4 text-sm text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center">
              Create tasks to track progress
            </div>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between py-3 border-t border-gray-100">
          <div className="flex -space-x-2">
            {project.members.slice(0, 3).map((member, index) => (
              <Avatar
                key={index}
                className="border-2 border-white w-8 h-8 ring-2 ring-white shadow-sm">
                <AvatarImage
                  src={member.image ? member.image : ""}
                  alt={member.name}
                />
                <AvatarFallback className="bg-gray-200 text-gray-600">
                  {member.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ))}
            {project.members.length > 3 && (
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-xs font-medium text-gray-700 border-2 border-white ring-2 ring-white shadow-sm">
                +{project.members.length - 3}
              </div>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-500 gap-1">
            <LuClock className="h-4 w-4" />
            {createdAt}
          </div>
        </div>

        <Link
          href={`/projects/${project.id}`}
          className="mt-3 flex items-center justify-center py-2 px-4 w-full text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group">
          View Project Details
          <LuChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </CardContent>
    </Card>
  );
}
