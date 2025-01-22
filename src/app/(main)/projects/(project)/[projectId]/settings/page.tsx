import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SettingsContent from "./components/settings-content";
import { getProjectInvitationCode } from "@/server/actions/project/invitation-code";

type Props = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function Settings({ params }: Props) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }
  const { projectId } = await params;

  const invitationCodeResult = await getProjectInvitationCode(
    projectId,
    session.user.id
  );

  if (invitationCodeResult.error) {
    throw new Error(invitationCodeResult.error.message);
  }

  const invitationCode = invitationCodeResult.data;

  return (
    <SettingsContent userId={session.user.id} invitationCode={invitationCode} />
  );
}
