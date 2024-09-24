import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LuClipboard, LuRotateCw } from "react-icons/lu";
import { InvitationCode } from "@/lib/schema/InvitationCodeSchema";
import { useProjectInvitationCodeMutation } from "@/hooks/useProjectQueries";
import { toast } from "sonner";
import { differenceInDays } from "date-fns";

interface ProjectInviteProps {
  projectId: string;
  invitationCode: InvitationCode | null;
}

export default function ProjectInvite({
  projectId,
  invitationCode,
}: ProjectInviteProps) {
  const {
    mutate: generateInvitationCode,
    isPending,
    error,
  } = useProjectInvitationCodeMutation(projectId);

  const handleRegenerate = async (projectId: string) => {
    generateInvitationCode(projectId, {
      onSuccess: () => {
        toast.success("Invitation code generated successfully!");
      },
      onError: () => {
        toast.error("Failed to generate invitation code!");
      },
    });
  };

  if (!invitationCode) {
    return (
      <Card className="w-full h-fit">
        <CardHeader>
          <CardTitle>Project Invite</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            No invitation code found. Please generate a new one.
          </CardDescription>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center gap-4">
          <Button
            variant="default"
            className="flex items-center gap-2"
            onClick={() => handleRegenerate(projectId)}
            disabled={isPending}>
            {isPending ? (
              <>
                <LuRotateCw className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <LuRotateCw className="w-4 h-4" />
                Generate Invitation Code
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const handleCopy = () => {
    navigator.clipboard
      .writeText(invitationCode.code)
      .then(() => toast.success("Invitation code copied to clipboard!"))
      .catch((err) => console.error("Failed to copy text: ", err));
  };

  const daysUntilExpiration = invitationCode.expiresAt
    ? differenceInDays(new Date(invitationCode.expiresAt), new Date())
    : null;

  return (
    <Card className="w-full h-fit">
      <CardHeader>
        <CardTitle className="text-xl">Project Invite</CardTitle>
        <CardDescription>
          Share this code to invite new members.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4">
        <div className="bg-primary/10 rounded-lg p-4 text-center">
          <span className="text-4xl font-mono font-bold text-primary">
            {invitationCode.code}
          </span>
          {daysUntilExpiration !== null && (
            <span className="text-sm text-muted-foreground mt-2">
              Expires in {daysUntilExpiration} days
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          className="flex items-center gap-2 text-destructive"
          onClick={() => handleRegenerate(projectId)}
          disabled={isPending}>
          {isPending ? (
            <>
              <LuRotateCw className="w-4 h-4 animate-spin" />
              Regenerating...
            </>
          ) : (
            <>
              <LuRotateCw className="w-4 h-4" />
              Regenerate
            </>
          )}
        </Button>
        <Button onClick={handleCopy} className="ml-2" variant="secondary">
          <LuClipboard className="mr-1" />
          Copy Code
        </Button>
      </CardFooter>
    </Card>
  );
}
