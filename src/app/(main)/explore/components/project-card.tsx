import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LuUsers,
  LuClock,
  LuArrowUpRight,
  LuBookmark,
  LuStar,
  LuGlobe,
  LuLayers,
  LuLightbulb,
  LuUserPlus,
  LuTrendingUp,
} from "react-icons/lu";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { PublicProject } from "@/database/schema";
import { ProjectStatus } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  project: PublicProject;
};

export default function ExploreProjectCard({ project }: Props) {
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
          cardBorder: "border-gray-100 dark:border-gray-800",
          label: "Planning",
          icon: LuLightbulb,
        };
    }
  };

  const statusConfig = getStatusConfig(project.status);
  const StatusIcon = statusConfig.icon;
  const createdAt = format(project.createdAt, "MMM d, yyyy");

  return (
    <Card
      className={cn(
        "group overflow-hidden rounded-2xl transition-all duration-300",
        "border shadow hover:shadow-md",
        "bg-white dark:bg-gray-800",
        statusConfig.cardBorder
      )}>
      <div className="relative">
        {/* Visual flourish - translucent colored arc in top-right */}
        <div
          className={cn(
            "absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-10",
            "bg-gradient-to-br",
            statusConfig.color
          )}
        />

        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-xl shadow",
                  "bg-gradient-to-br",
                  statusConfig.color
                )}>
                <StatusIcon className="h-5 w-5 text-white" />
              </div>

              <div className="min-w-0 flex-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={`/projects/${project.id}`}
                        className="block group-hover:scale-[1.01] transition-transform">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate max-w-[180px]">
                          {project.name}
                        </h3>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      {project.name}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Badge
                  className={cn(
                    "rounded-full py-0.5 px-2 text-xs font-medium text-white",
                    "bg-gradient-to-r",
                    statusConfig.color
                  )}>
                  {statusConfig.label}
                </Badge>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              className={cn(
                "rounded-full h-8 w-8 p-0 flex-shrink-0 ml-2",
                statusConfig.bgColor,
                statusConfig.darkBgColor,
                "border",
                statusConfig.borderColor,
                statusConfig.darkBorderColor,
                statusConfig.textColor,
                statusConfig.darkTextColor,
                "hover:bg-white dark:hover:bg-gray-800"
              )}>
              <LuBookmark className="h-4 w-4" />
              <span className="sr-only">Save</span>
            </Button>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* Stats bar */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
              <div
                className={cn(
                  "flex items-center justify-center w-6 h-6 rounded-full",
                  statusConfig.bgColor,
                  statusConfig.darkBgColor
                )}>
                <LuUsers
                  className={cn("h-3.5 w-3.5", statusConfig.iconColor)}
                />
              </div>
              <span>{project.memberCount}</span>
            </div>
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
              <div
                className={cn(
                  "flex items-center justify-center w-6 h-6 rounded-full",
                  statusConfig.bgColor,
                  statusConfig.darkBgColor
                )}>
                <LuClock
                  className={cn("h-3.5 w-3.5", statusConfig.iconColor)}
                />
              </div>
              <span>{createdAt}</span>
            </div>
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
              <div
                className={cn(
                  "flex items-center justify-center w-6 h-6 rounded-full",
                  statusConfig.bgColor,
                  statusConfig.darkBgColor
                )}>
                <LuTrendingUp
                  className={cn("h-3.5 w-3.5", statusConfig.iconColor)}
                />
              </div>
              <span>Active</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-gray-700 my-4"></div>

          {/* Footer with Team & Action */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {project.members.slice(0, 3).map((member, index) => (
                  <Avatar
                    key={index}
                    className="border-2 border-white dark:border-gray-800 w-8 h-8 rounded-full shadow-sm">
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
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 border-2 border-white dark:border-gray-800 shadow-sm">
                    +{project.members.length - 3}
                  </div>
                )}
              </div>
            </div>

            <Button
              asChild
              className={cn(
                "rounded-full shadow-sm",
                "bg-gradient-to-r hover:shadow text-white",
                "transition-all duration-300 group/btn",
                statusConfig.color
              )}>
              <Link
                href={`/projects/${project.id}`}
                className="flex items-center gap-1.5 py-2">
                <LuUserPlus className="h-4 w-4" />
                <span>Join Project</span>
                <LuArrowUpRight className="h-4 w-4 ml-0.5 transform transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
