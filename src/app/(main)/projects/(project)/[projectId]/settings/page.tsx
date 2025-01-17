import UpdateProjectDetails from "./components/update-project-details";
import ProjectVisibility from "./components/project-visibilty";
import DangerZone from "./components/danger-zone";
import ProjectInvite from "./components/project-invite";
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
import { getProject, getProjectInvitationCode } from "../actions";
import SettingsContent from "./components/settings-content";

type Props = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function Settings({ params }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }
  const { projectId } = await params;

  const invitationCodeResult = await getProjectInvitationCode(
    projectId,
    session.user.id
  );

  if (invitationCodeResult.error) {
    throw new Error(invitationCodeResult.error);
  }

  const invitationCode = invitationCodeResult.data;

  return <SettingsContent invitationCode={invitationCode} />;
}
