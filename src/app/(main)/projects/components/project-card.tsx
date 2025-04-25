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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import {
  LuMoreVertical,
  LuCalendar,
  LuCheckCircle2,
  LuUsers,
  LuClock,
  LuClipboard,
  LuTrash2,
  LuChevronRight,
  LuArrowUpRight,
  LuLightbulb,
  LuGlobe,
  LuActivity,
  LuLayers,
} from "react-icons/lu";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { MemberProject } from "@/database/schema";
import { ProjectStatus } from "@/lib/config";
import { cn } from "@/lib/utils";

type Props = {
  project: MemberProject;
};

export default function ProjectCard({ project }: Props) {
  // Enhanced status configuration with more visual properties
  const getStatusConfig = (status: ProjectStatus) => {
    switch (status) {
      case "LIVE":
        return {
          color: "from-emerald-500 to-teal-500",
          bgColor: "bg-emerald-50",
          darkBgColor: "dark:bg-emerald-950/20",
          iconColor: "text-emerald-500",
          borderColor: "border-emerald-200",
          darkBorderColor: "dark:border-emerald-900",
          textColor: "text-emerald-700",
          darkTextColor: "dark:text-emerald-400",
          badgeColor: "bg-gradient-to-r from-emerald-500 to-teal-500",
          label: "Live",
          icon: LuGlobe,
        };
      case "BUILDING":
        return {
          color: "from-blue-500 to-indigo-500",
          bgColor: "bg-blue-50",
          darkBgColor: "dark:bg-blue-950/20",
          iconColor: "text-blue-500",
          borderColor: "border-blue-200",
          darkBorderColor: "dark:border-blue-900",
          textColor: "text-blue-700",
          darkTextColor: "dark:text-blue-400",
          badgeColor: "bg-gradient-to-r from-blue-500 to-indigo-500",
          label: "Building",
          icon: LuLayers,
        };
      default:
        return {
          color: "from-gray-500 to-slate-500",
          bgColor: "bg-gray-50",
          darkBgColor: "dark:bg-gray-800/50",
          iconColor: "text-gray-500",
          borderColor: "border-gray-200",
          darkBorderColor: "dark:border-gray-700",
          textColor: "text-gray-700",
          darkTextColor: "dark:text-gray-400",
          badgeColor: "bg-gradient-to-r from-gray-500 to-slate-500",
          label: "Planning",
          icon: LuLightbulb,
        };
    }
  };

  const statusConfig = getStatusConfig(project.status);
  const StatusIcon = statusConfig.icon;
  const createdAt = format(project.createdAt, "MMM d, yyyy");

  const hasNoTasks = project.totalTasksCount === 0;
  const progressPercentage = hasNoTasks
    ? 0
    : (project.completedTasksCount / project.totalTasksCount) * 100;

  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return "from-emerald-500 to-green-500";
    if (percentage >= 40) return "from-blue-500 to-cyan-500";
    return "from-amber-500 to-yellow-500";
  };

  return (
    <Card
      className={cn(
        "overflow-hidden rounded-2xl transition-all duration-300 group flex flex-col",
        "border-0",
        statusConfig.bgColor,
        statusConfig.darkBgColor
      )}>
      <div className="relative p-6 pb-4">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-bl-full bg-gradient-to-br from-current to-transparent" />
        <div className="flex justify-between items-start relative">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-xl shadow-md",
                "bg-gradient-to-br",
                statusConfig.color
              )}>
              <StatusIcon className="h-6 w-6 text-white" />
            </div>

            <div className="min-w-0 flex-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={`/projects/${project.id}`}
                      className="block group">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate max-w-[220px]">
                        {project.name}
                      </h3>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    {project.name}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="flex items-center mt-1">
                <Badge
                  className={cn(
                    "rounded-full py-0.5 px-2.5 text-xs font-medium text-white",
                    statusConfig.badgeColor
                  )}>
                  {statusConfig.label}
                </Badge>
                <span className="ml-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <LuUsers className="mr-1 h-3.5 w-3.5" />
                  {project.memberCount} members
                </span>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full hover:bg-white/50 dark:hover:bg-gray-800/50 flex-shrink-0 ml-2">
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
              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950/50 dark:focus:text-red-400">
                <LuTrash2 className="mr-2 h-4 w-4" /> Move to Trash
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="px-6 pt-4 pb-6 bg-white dark:bg-gray-800 rounded-t-3xl -mt-2 flex-1 flex flex-col">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-5 line-clamp-2">
          {project.description}
        </p>

        <div className="mb-6">
          <div className="flex justify-between items-center text-sm mb-2">
            <div className="flex items-center gap-2">
              <LuActivity className={cn("h-4 w-4", statusConfig.iconColor)} />
              <span
                className={cn(
                  "font-medium",
                  statusConfig.textColor,
                  statusConfig.darkTextColor
                )}>
                Task Progress
              </span>
            </div>
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              {hasNoTasks
                ? "No tasks"
                : `${project.completedTasksCount}/${project.totalTasksCount}`}
            </span>
          </div>

          {!hasNoTasks ? (
            <div className="space-y-2">
              <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full bg-gradient-to-r transition-all duration-700",
                    getProgressColor(progressPercentage)
                  )}
                  style={{ width: `${progressPercentage}%` }}
                  aria-label={`${progressPercentage.toFixed(0)}% complete`}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <LuCalendar className="h-3 w-3" />
                  <span>Updated 3 days ago</span>
                </div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {progressPercentage.toFixed(0)}% Complete
                </span>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                "py-2 px-4 text-sm text-center rounded-xl border border-dashed",
                statusConfig.textColor,
                statusConfig.darkTextColor,
                statusConfig.borderColor,
                statusConfig.darkBorderColor,
                "bg-white/50 dark:bg-gray-800/50"
              )}>
              Create tasks to track progress
            </div>
          )}
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {project.members.slice(0, 3).map((member, index) => (
                  <Avatar
                    key={index}
                    className="border-2 border-white dark:border-gray-800 w-8 h-8 rounded-xl overflow-hidden shadow-sm">
                    <AvatarImage
                      src={member.image ? member.image : ""}
                      alt={member.name}
                    />
                    <AvatarFallback className="bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-200">
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {project.members.length > 3 && (
                  <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 border-2 border-white dark:border-gray-800 shadow-sm">
                    +{project.members.length - 3}
                  </div>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <LuClock className="inline h-4 w-4 mr-1" />
              {createdAt}
            </div>
          </div>
          <Link
            href={`/projects/${project.id}`}
            className={cn(
              "mt-5 flex items-center justify-center py-2.5 px-4 w-full",
              "text-sm font-medium text-white rounded-xl shadow-sm",
              "transition-all duration-300 group/btn",
              "bg-gradient-to-r hover:shadow-lg hover:translate-y-px",
              statusConfig.color
            )}>
            View Project Details
            <LuArrowUpRight className="ml-1.5 h-4 w-4 transform transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
