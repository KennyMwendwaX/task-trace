import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LuUsers,
  LuClock,
  LuArrowRight,
  LuBookmark,
  LuStar,
} from "react-icons/lu";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { PublicProject } from "@/database/schema";
import { ProjectStatus } from "@/lib/config";

type Props = {
  project: PublicProject;
};

export default function ExploreProjectCard({ project }: Props) {
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

  return (
    <Card className="group overflow-hidden border-0 transition-all duration-300 bg-white dark:bg-gray-800">
      {/* Status Banner */}
      <div className={`h-1.5 w-full ${statusConfig.color}`}></div>

      <CardHeader className="relative pb-2 pt-4">
        <div className="flex justify-between items-start">
          <Link
            href={`/projects/${project.id}`}
            className="block group-hover:scale-[1.01] transition-transform">
            <CardTitle className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-blue-600 transition-colors">
              {project.name}
            </CardTitle>
          </Link>

          <Badge
            className={`${statusConfig.color} ${statusConfig.textColor} border-0 rounded-full text-xs py-1 px-3 shadow-sm`}>
            {project.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col h-full pt-0 space-y-4">
        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {project.description}
        </p>

        {/* Stats Bar */}
        <div className="flex items-center justify-between gap-3 text-sm text-gray-600 dark:text-gray-400 pt-1">
          <div className="flex items-center">
            <LuUsers className="mr-1 h-4 w-4" />
            <span>{project.memberCount} members</span>
          </div>
          <div className="flex items-center">
            <LuClock className="mr-1 h-4 w-4" />
            <span>{createdAt}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 dark:border-gray-700 pt-3 -mx-6 px-6"></div>

        {/* Footer with Team & Action */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex items-center">
            <div className="flex -space-x-2 mr-2">
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
          </div>

          <Link
            href={`/projects/${project.id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center group/link">
            Join Project
            <LuArrowRight className="ml-1 h-4 w-4 transform transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
