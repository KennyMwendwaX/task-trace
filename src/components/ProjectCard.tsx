import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Project } from "@/lib/schema/ProjectSchema";
import Link from "next/link";
import { IoChevronForward } from "react-icons/io5";
import { LuMoreVertical, LuTruck, LuUser2 } from "react-icons/lu";
import { statuses } from "@/lib/config";
import format from "date-fns/format";
import Image from "next/image";
import Logo from "../../public/logo.png";

interface Props {
  project: Project;
}

// export default function ProjectCard({ project }: Props) {
// const projectStatus = statuses.find(
//   (status) => status.value === project.status
// );
export default function ProjectCard() {
  return (
    <>
      {/* <Card>
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
      </Card> */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Image src={Logo} width={32} height={32} alt="Project logo" />
            <div>
              <CardTitle className="text-lg hover:underline cursor-pointer">
                GO CLI Interface
              </CardTitle>
              <Badge
                variant="outline"
                className="border-green-600 text-green-500">
                Live
              </Badge>
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
