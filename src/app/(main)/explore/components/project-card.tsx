import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LuUsers,
  LuClock,
  LuArrowRight,
  LuBookmark,
  LuGlobe,
  LuLayers,
  LuLightbulb,
  LuPlay,
  LuLock,
  LuCheckCircle2,
  LuCalendar,
} from "react-icons/lu";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { PublicProject } from "@/server/database/schema";
import { ProjectStatus } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useTransition } from "react";
import { tryCatch } from "@/lib/try-catch";
import { toggleProjectBookmark } from "@/server/actions/project/bookmark";
import { toast } from "sonner";

type Props = {
  project: PublicProject;
};

export default function ExploreProjectCard({ project }: Props) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(project.isBookmarked);
  const [isPending, startTransition] = useTransition();

  // Enhanced status configuration with more visual properties
  const getStatusConfig = (status: ProjectStatus) => {
    switch (status) {
      case "LIVE":
        return {
          color: "text-emerald-600 bg-emerald-50 border-emerald-200",
          darkColor:
            "dark:text-emerald-400 dark:bg-emerald-950/20 dark:border-emerald-900",
          gradientFrom: "from-emerald-500",
          gradientTo: "to-teal-500",
          iconColor: "text-emerald-500",
          label: "Live",
          icon: "🌍",
          iconComponent: LuGlobe,
        };
      case "BUILDING":
        return {
          color: "text-blue-600 bg-blue-50 border-blue-200",
          darkColor:
            "dark:text-blue-400 dark:bg-blue-950/20 dark:border-blue-900",
          gradientFrom: "from-blue-500",
          gradientTo: "to-indigo-500",
          iconColor: "text-blue-500",
          label: "Building",
          icon: "🏗️",
          iconComponent: LuLayers,
        };
      default:
        return {
          color: "text-gray-600 bg-gray-50 border-gray-200",
          darkColor:
            "dark:text-gray-400 dark:bg-gray-800/50 dark:border-gray-700",
          gradientFrom: "from-gray-500",
          gradientTo: "to-slate-500",
          iconColor: "text-gray-500",
          label: "Planning",
          icon: "💡",
          iconComponent: LuLightbulb,
        };
    }
  };

  const getAccessConfig = (isPublic: boolean) => {
    return isPublic
      ? {
          icon: "🌐",
          iconComponent: LuGlobe,
          label: "Public",
          color: "text-blue-600 bg-blue-50 border-blue-200",
          darkColor:
            "dark:text-blue-400 dark:bg-blue-950/20 dark:border-blue-900",
        }
      : {
          icon: "🔒",
          iconComponent: LuLock,
          label: "Private",
          color: "text-amber-600 bg-amber-50 border-amber-200",
          darkColor:
            "dark:text-amber-400 dark:bg-amber-950/20 dark:border-amber-900",
        };
  };

  const statusConfig = getStatusConfig(project.status);
  const accessConfig = getAccessConfig(project.isPublic);
  const createdAt = format(project.createdAt, "MMM d, yyyy");
  const isHovered = hoveredCard === project.id.toString();

  // Calculate progress
  const progressPercentage =
    project.totalTasksCount > 0
      ? Math.round(
          (project.completedTasksCount / project.totalTasksCount) * 100
        )
      : 0;

  const toggleBookmark = () => {
    // Optimistic update
    setIsBookmarked(!isBookmarked);

    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        toggleProjectBookmark(project.id)
      );

      if (error) {
        // Revert optimistic update
        setIsBookmarked(isBookmarked);
        toast.error("Failed to toggle bookmark");
        return;
      }

      // Sync with server state (in case of conflicts)
      setIsBookmarked(result.isBookmarked);
      toast.success(
        result.isBookmarked ? "Quiz bookmarked" : "Bookmark removed"
      );
    });
  };

  return (
    <Card
      className="group h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 overflow-hidden bg-gradient-to-br from-card to-card/80"
      onMouseEnter={() => setHoveredCard(project.id.toString())}
      onMouseLeave={() => setHoveredCard(null)}>
      <CardHeader className="pb-4 space-y-3">
        {/* Top row with status, access, and bookmark */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              className={cn(
                "px-3 py-1.5 text-xs font-medium border-0 shadow-sm rounded-full",
                "bg-gradient-to-r text-white",
                statusConfig.gradientFrom,
                statusConfig.gradientTo
              )}>
              <statusConfig.iconComponent className="w-3 h-3 mr-1.5" />
              {statusConfig.label}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-full border",
                "bg-background/80 backdrop-blur-sm",
                accessConfig.color,
                accessConfig.darkColor
              )}>
              <accessConfig.iconComponent className="w-3 h-3 mr-1.5" />
              {accessConfig.label}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-8 p-0 rounded-full transition-all duration-200",
              isBookmarked
                ? "bg-primary/10 hover:bg-primary/20"
                : "hover:bg-muted",
              isPending && "opacity-50 cursor-not-allowed"
            )}
            onClick={toggleBookmark}
            title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            disabled={isPending}>
            <LuBookmark
              className={cn(
                "h-4 w-4 transition-all duration-200",
                isBookmarked
                  ? "fill-primary text-primary scale-110"
                  : "text-muted-foreground hover:text-foreground"
              )}
            />
            <span className="sr-only">
              {isBookmarked ? "Remove bookmark" : "Add bookmark"}
            </span>
          </Button>
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

        {/* Progress bar */}
        {project.totalTasksCount > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Progress</span>
              <span className="text-xs font-medium text-foreground">
                {progressPercentage}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={cn(
                  "h-2 rounded-full transition-all duration-300 bg-gradient-to-r",
                  statusConfig.gradientFrom,
                  statusConfig.gradientTo
                )}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="pb-4 pt-0 space-y-4 flex-grow">
        <Separator className="opacity-30" />

        {/* Project stats */}
        <div className="grid grid-cols-3 gap-2">
          {/* Members */}
          <div className="group/stat relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 p-3 border border-blue-100 dark:border-blue-900/30 hover:shadow-sm transition-all duration-200">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 dark:bg-blue-400/10">
                <LuUsers className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 truncate">
                  {project.memberCount}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Member{project.memberCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div className="group/stat relative overflow-hidden rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 p-3 border border-emerald-100 dark:border-emerald-900/30 hover:shadow-sm transition-all duration-200">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10">
                <LuCheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 truncate">
                  {project.totalTasksCount > 0 ? (
                    <>
                      {project.completedTasksCount}/{project.totalTasksCount}
                    </>
                  ) : (
                    "No tasks"
                  )}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  Tasks
                </p>
              </div>
            </div>
          </div>

          {/* Created */}
          <div className="group/stat relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 p-3 border border-purple-100 dark:border-purple-900/30 hover:shadow-sm transition-all duration-200">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/10 dark:bg-purple-400/10">
                <LuCalendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-purple-900 dark:text-purple-100 truncate">
                  {format(project.createdAt, "MMM d")}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  Created
                </p>
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
            "w-full h-10 text-sm font-semibold transition-all duration-300 shadow-sm",
            isHovered
              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
          asChild>
          <Link
            href={`/projects/${project.id}`}
            className="flex items-center justify-center gap-2">
            <LuPlay className="h-4 w-4" />
            {project.isPublic ? "Join Project" : "Request Access"}
            <LuArrowRight
              className={cn(
                "h-4 w-4 transition-all duration-300",
                isHovered && "translate-x-1"
              )}
            />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
