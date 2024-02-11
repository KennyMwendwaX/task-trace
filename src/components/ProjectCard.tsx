import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Project } from "@/lib/schema/ProjectSchema";
import Link from "next/link";
import { IoChevronForward } from "react-icons/io5";
import { LuUser2 } from "react-icons/lu";
import { statuses } from "@/lib/config";
import format from "date-fns/format";

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  const projectStatus = statuses.find(
    (status) => status.value === project.status
  );

  return (
    <>
      <Card>
        <CardHeader className="space-y-2">
          <h2 className="font-semibold text-lg">{project.name}</h2>
          <div className="flex items-center space-x-1">
            <Avatar>
              <AvatarImage src={""} />
              <AvatarFallback>
                <LuUser2 className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div>{project.owner.name}</div>
              <div className="text-xs text-gray-500">
                {format(new Date(project.createdAt), "dd/MM/yyyy")}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {projectStatus?.value === "DONE" ? (
            <Badge
              variant="outline"
              className="border-green-600 text-green-500">
              {projectStatus?.label}
            </Badge>
          ) : projectStatus?.value === "TO_DO" ? (
            <Badge variant="outline" className="border-blue-600 text-blue-500">
              {projectStatus?.label}
            </Badge>
          ) : projectStatus?.value === "IN_PROGRESS" ? (
            <Badge
              variant="outline"
              className="border-orange-600 text-orange-500">
              {projectStatus?.label}
            </Badge>
          ) : projectStatus?.value === "CANCELED" ? (
            <Badge variant="outline" className="border-red-600 text-red-500">
              {projectStatus?.label}
            </Badge>
          ) : null}
          <p className="text-sm text-gray-500">{project.description}</p>
          <p className="text-sm text-gray-500">Task Completion Rate: 35/50</p>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-full text-xs text-center text-white bg-blue-500 rounded-full"
              style={{
                width: "70%",
              }}
            />
            <p className="text-xs text-gray-500 text-right">70% Complete</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Link
            href={`/projects/${project.id}`}
            className="flex items-center cursor-pointer text-sm text-blue-800 hover:underline">
            <span>View project</span>
            <IoChevronForward className="w-3 h-3" />
          </Link>
        </CardFooter>
      </Card>
    </>
  );
}
