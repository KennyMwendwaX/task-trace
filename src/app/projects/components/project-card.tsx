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
import { LuMoreVertical } from "react-icons/lu";
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
  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Image src={Logo} width={32} height={32} alt="Project logo" />
            <div>
              <Link href={`/projects/${project.id}`}>
                <CardTitle className="text-lg hover:underline cursor-pointer">
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
            <div className="ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="outline" className="h-8 w-8">
                    <LuMoreVertical className="h-3.5 w-3.5" />
                    <span className="sr-only">More</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Pin</DropdownMenuItem>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Trash</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <div className="text-sm text-gray-500">70% Complete</div>
            <div className="text-sm text-gray-500">17/25 tasks</div>
          </div>
          <Progress value={12} aria-label="12% increase" />
          <div className="text-sm text-gray-500 font-semibold">
            Last updated 3 days ago
          </div>
        </CardContent>
      </Card>
    </>
  );
}
