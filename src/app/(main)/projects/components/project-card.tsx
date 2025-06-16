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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  LuMoreVertical,
  LuCalendar,
  LuCheckCircle2,
  LuUsers,
  LuClipboard,
  LuTrash2,
  LuArrowUpRight,
  LuLightbulb,
  LuGlobe,
  LuActivity,
  LuLayers,
  LuPlay,
  LuPin,
} from "react-icons/lu";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { MemberProject } from "@/server/database/schema";
import { ProjectStatus } from "@/lib/config";
import { cn } from "@/lib/utils";
import { useState, useTransition } from "react";

type Props = {
  project: MemberProject;
  isPinned?: boolean;
  onPin?: (projectId: string) => void;
  onBookmark?: (projectId: string) => void;
};

export default function ProjectCard({
  project,
  isPinned = false,
  onPin,
  onBookmark,
}: Props) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isPending, startTransition] = useTransition();

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
          statBg:
            "from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20",
          statBorder: "border-emerald-100 dark:border-emerald-900/30",
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
          statBg:
            "from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20",
          statBorder: "border-blue-100 dark:border-blue-900/30",
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
          statBg:
            "from-gray-50 to-gray-100/50 dark:from-gray-950/30 dark:to-gray-900/20",
          statBorder: "border-gray-100 dark:border-gray-900/30",
          label: "Planning",
          icon: LuLightbulb,
        };
    }
  };

  const statusConfig = getStatusConfig(project.status);
  const StatusIcon = statusConfig.icon;
  const createdAt = format(project.createdAt, "MMM d, yyyy");
  const isHovered = hoveredCard === project.id.toString();

  const hasNoTasks = project.totalTasksCount === 0;
  const progressPercentage = hasNoTasks
    ? 0
    : Math.round((project.completedTasksCount / project.totalTasksCount) * 100);

  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return "from-emerald-500 to-green-500";
    if (percentage >= 40) return "from-blue-500 to-cyan-500";
    return "from-amber-500 to-yellow-500";
  };

  const toggleBookmark = () => {
    startTransition(() => {
      setIsBookmarked(!isBookmarked);
      onBookmark?.(project.id.toString());
    });
  };

  const handlePin = () => {
    onPin?.(project.id.toString());
  };

  return (
    <Card
      className="group h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 overflow-hidden bg-gradient-to-br from-card to-card/80"
      onMouseEnter={() => setHoveredCard(project.id.toString())}
      onMouseLeave={() => setHoveredCard(null)}>
      <CardHeader className="pb-4 space-y-3">
        {/* Top row with status, pin indicator, and menu */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              className={cn(
                "px-3 py-1.5 text-xs font-medium border-0 shadow-sm rounded-full",
                "bg-gradient-to-r text-white",
                statusConfig.color
              )}>
              <StatusIcon className="w-3 h-3 mr-1.5" />
              {statusConfig.label}
            </Badge>
            {isPinned && (
              <Badge
                variant="outline"
                className="px-3 py-1.5 text-xs font-medium rounded-full border bg-background/80 backdrop-blur-sm text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/20 dark:border-amber-900">
                <LuPin className="w-3 h-3 mr-1.5" />
                Pinned
              </Badge>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 rounded-full hover:bg-muted">
                <LuMoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="cursor-pointer" onClick={handlePin}>
                <LuPin className="mr-2 h-4 w-4" />
                {isPinned ? "Unpin Project" : "Pin Project"}
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

        {/* Title and description */}
        <div className="space-y-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/projects/${project.id}`} className="block">
                  <h3 className="text-lg leading-tight line-clamp-2 font-bold text-foreground group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                {project.name}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Progress section */}
        {!hasNoTasks ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LuActivity className={cn("h-4 w-4", statusConfig.iconColor)} />
                <span className="text-xs text-muted-foreground">
                  Task Progress
                </span>
              </div>
              <span className="text-xs font-medium text-foreground">
                {progressPercentage}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={cn(
                  "h-2 rounded-full transition-all duration-700 bg-gradient-to-r",
                  getProgressColor(progressPercentage)
                )}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "py-3 px-4 text-sm text-center rounded-xl border border-dashed",
              statusConfig.textColor,
              statusConfig.darkTextColor,
              statusConfig.borderColor,
              statusConfig.darkBorderColor,
              "bg-background/50"
            )}>
            Create tasks to track progress
          </div>
        )}
      </CardHeader>

      <CardContent className="pb-4 pt-0 space-y-4 flex-grow">
        <Separator className="opacity-30" />

        {/* Project stats */}
        <div className="grid grid-cols-3 gap-2">
          {/* Members */}
          <div
            className={cn(
              "group/stat relative overflow-hidden rounded-lg p-3 border hover:shadow-sm transition-all duration-200 bg-gradient-to-br",
              statusConfig.statBg,
              statusConfig.statBorder
            )}>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full",
                  statusConfig.iconColor.replace("text-", "bg-") + "/10"
                )}>
                <LuUsers className={cn("h-4 w-4", statusConfig.iconColor)} />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-sm font-semibold truncate",
                    statusConfig.textColor,
                    statusConfig.darkTextColor
                  )}>
                  {project.memberCount}
                </p>
                <p className={cn("text-xs", statusConfig.iconColor)}>
                  Member{project.memberCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div
            className={cn(
              "group/stat relative overflow-hidden rounded-lg p-3 border hover:shadow-sm transition-all duration-200 bg-gradient-to-br",
              statusConfig.statBg,
              statusConfig.statBorder
            )}>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full",
                  statusConfig.iconColor.replace("text-", "bg-") + "/10"
                )}>
                <LuCheckCircle2
                  className={cn("h-4 w-4", statusConfig.iconColor)}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-sm font-semibold truncate",
                    statusConfig.textColor,
                    statusConfig.darkTextColor
                  )}>
                  {project.totalTasksCount > 0 ? (
                    <>
                      {project.completedTasksCount}/{project.totalTasksCount}
                    </>
                  ) : (
                    "No tasks"
                  )}
                </p>
                <p className={cn("text-xs", statusConfig.iconColor)}>Tasks</p>
              </div>
            </div>
          </div>

          {/* Created */}
          <div
            className={cn(
              "group/stat relative overflow-hidden rounded-lg p-3 border hover:shadow-sm transition-all duration-200 bg-gradient-to-br",
              statusConfig.statBg,
              statusConfig.statBorder
            )}>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full",
                  statusConfig.iconColor.replace("text-", "bg-") + "/10"
                )}>
                <LuCalendar className={cn("h-4 w-4", statusConfig.iconColor)} />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-sm font-semibold truncate",
                    statusConfig.textColor,
                    statusConfig.darkTextColor
                  )}>
                  {format(project.createdAt, "MMM d")}
                </p>
                <p className={cn("text-xs", statusConfig.iconColor)}>Created</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team members */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Team:</span>
            <div className="flex -space-x-2">
              {project.members.slice(0, 3).map((member, index) => (
                <Avatar
                  key={index}
                  className="border-2 border-white dark:border-gray-800 w-7 h-7 rounded-full shadow-sm">
                  <AvatarImage
                    src={member.image ? member.image : ""}
                    alt={member.name}
                  />
                  <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                    {member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {project.members.length > 3 && (
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-muted text-xs font-medium text-muted-foreground border-2 border-white dark:border-gray-800 shadow-sm">
                  +{project.members.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-4">
        <Button
          className={cn(
            "w-full h-10 text-sm font-semibold transition-all duration-300 shadow-sm bg-gradient-to-r text-white",
            statusConfig.color,
            isHovered
              ? "shadow-md shadow-primary/20 scale-[1.02]"
              : "hover:shadow-lg"
          )}
          asChild>
          <Link
            href={`/projects/${project.id}`}
            className="flex items-center justify-center gap-2">
            <LuPlay className="h-4 w-4" />
            View Project Details
            <LuArrowUpRight
              className={cn(
                "h-4 w-4 transition-all duration-300",
                isHovered && "translate-x-0.5 -translate-y-0.5"
              )}
            />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
