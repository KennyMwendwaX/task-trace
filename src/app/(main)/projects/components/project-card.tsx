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
} from "react-icons/lu";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MemberProject } from "@/lib/schema/ProjectSchema";
import { format } from "date-fns";

type Props = {
  project: MemberProject;
};

export default function ProjectCard({ project }: Props) {
  const statusColor =
    project.status === "LIVE"
      ? "border-green-600 text-green-600"
      : "border-blue-600 text-blue-600";
  const createdAt = format(project.createdAt, "MMM d, yyyy");

  const hasNoTasks = project.totalTasksCount === 0;
  const progressPercentage = hasNoTasks
    ? 0
    : (project.completedTasksCount / project.totalTasksCount) * 100;

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-2 relative">
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <LuMoreVertical className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <LuCheckCircle2 className="mr-2 h-4 w-4" /> Pin
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LuClipboard className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LuTrash2 className="mr-2 h-4 w-4" /> Trash
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Link href={`/projects/${project.id}`} className="block group">
          <CardTitle className="text-xl font-semibold group-hover:text-blue-600 transition-colors duration-200">
            {project.name}
          </CardTitle>
        </Link>
        <div className="flex items-center space-x-2 mt-2">
          <Badge variant="outline" className={statusColor}>
            {project.status}
          </Badge>
          <Badge variant="outline" className="text-sm">
            <LuUsers className="mr-1 h-4 w-4" /> {project.memberCount}&nbsp;
            members
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mt-2 mb-4 line-clamp-2">
          {project.description}
        </p>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-gray-700">Progress</span>
            <span className="text-gray-600 font-medium">
              {hasNoTasks
                ? "No tasks"
                : `${project.completedTasksCount}/${project.totalTasksCount} tasks`}
            </span>
          </div>
          {!hasNoTasks && (
            <>
              <Progress
                value={progressPercentage}
                className="h-2"
                aria-label={`${progressPercentage.toFixed(0)}% complete`}
              />
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <LuCalendar className="mr-2 h-4 w-4" />
                  Last updated 3 days ago
                </div>
                <span className="font-semibold text-blue-600">
                  {progressPercentage.toFixed(0)}% Complete
                </span>
              </div>
            </>
          )}
          {hasNoTasks && (
            <div className="py-2 text-sm text-gray-500 text-center">
              Create tasks to track progress
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex -space-x-2">
            {project.members.slice(0, 3).map((member, index) => (
              <Avatar key={index} className="border-2 border-white w-8 h-8">
                <AvatarImage
                  src={member.image ? member.image : ""}
                  alt={member.name}
                />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
            {project.members.length > 3 && (
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-xs font-medium text-gray-600 border-2 border-white">
                +{project.members.length - 3}
              </div>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <LuClock className="mr-1 h-4 w-4" />
            {createdAt}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
