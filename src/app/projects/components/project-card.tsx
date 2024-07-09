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
import { Project } from "@/lib/schema/ProjectSchema";
import { LuMoreVertical, LuCalendar, LuCheckCircle2 } from "react-icons/lu";
import { projectStatuses } from "@/lib/config";
import Image from "next/image";
import Logo from "../../../../public/logo.png";
import Link from "next/link";

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  const projectStatus = projectStatuses.find(
    (status) => status.value === project.status
  );

  const completedTasks = 17;
  const totalTasks = 25;
  const progressPercentage = (completedTasks / totalTasks) * 100;

  return (
    <Card className="hover:shadow-md transition-all duration-300 group">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image
              src={Logo}
              width={40}
              height={40}
              alt="Project logo"
              className="rounded-full border border-gray-200"
            />
            <div>
              <Link href={`/projects/${project.id}`}>
                <CardTitle className="text-lg font-semibold group-hover:text-blue-600 transition-colors duration-200">
                  {project.name}
                </CardTitle>
              </Link>
              {projectStatus?.value === "LIVE" ? (
                <Badge
                  variant="outline"
                  className="border-green-600 text-green-500">
                  {projectStatus?.label}
                </Badge>
              ) : projectStatus?.value === "BUILDING" ? (
                <Badge
                  variant="outline"
                  className="border-blue-600 text-blue-500">
                  {projectStatus?.label}
                </Badge>
              ) : null}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 opacity-70 hover:opacity-100">
                <LuMoreVertical className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <LuCheckCircle2 className="mr-2 h-4 w-4" /> Pin
              </DropdownMenuItem>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Trash
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-4 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-gray-700">Progress</span>
            <span className="text-gray-600 font-medium">
              {completedTasks}/{totalTasks} tasks
            </span>
          </div>
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
        </div>
      </CardContent>
    </Card>
  );
}
