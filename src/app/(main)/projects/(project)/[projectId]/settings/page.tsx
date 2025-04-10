import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SettingsContent from "./components/settings-content";
import { getProjectInvitationCode } from "@/server/api/project/invitation-code";

type Props = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function Settings({ params }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }
  const { projectId } = await params;

  const invitationCodeResult = await getProjectInvitationCode(
    projectId,
    session.user.id
  );

  const invitationCode = invitationCodeResult.data;

  return (
    <SettingsContent userId={session.user.id} invitationCode={invitationCode} />
  );
}
