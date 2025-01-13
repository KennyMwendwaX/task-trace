import MemberTable from "./components/members-table/table";
import { TableColumns } from "./components/members-table/table-columns";
import { FiUserPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { AiOutlinePlus } from "react-icons/ai";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { getProject, getProjectMembers } from "../actions";
import MembersContent from "./components/members-content";

type Props = {
  params: Promise<{
    projectId: string;
  }>;
};
export default async function Members({ params }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }
  const { projectId } = await params;

  const projectResult = await getProject(projectId, session.user.id);
  const membersResult = await getProjectMembers(projectId, session.user.id);

  if (projectResult.error) {
    throw new Error(projectResult.error);
  }

  if (membersResult.error) {
    throw new Error(membersResult.error);
  }

  const project = projectResult.data;
  const members = membersResult.data ?? [];

  if (!project) {
    notFound();
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/projects/${projectId}`}>
                  {project.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Members</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <MembersContent
        projectId={projectId}
        project={project}
        members={members}
      />
    </>
  );
}
