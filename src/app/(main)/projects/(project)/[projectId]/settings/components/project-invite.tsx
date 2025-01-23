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
import { toast } from "sonner";
import { differenceInDays } from "date-fns";
import { useTransition } from "react";
import { generateInvitationCode } from "@/server/actions/project/invitation-code";

interface ProjectInviteProps {
  projectId: string;
  invitationCode: InvitationCode | null;
}

export default function ProjectInvite({
  projectId,
  invitationCode,
}: ProjectInviteProps) {
  const [isPending, startTransition] = useTransition();

  const handleGenerate = (projectId: string) => {
    startTransition(async () => {
      const result = await generateInvitationCode(projectId);

      if (result.error) {
        toast.error(result.error.message);
        return;
      }

      toast.success("Successfully generated new invitation code");
    });
  };

  const handleCopy = () => {
    if (invitationCode) {
      navigator.clipboard
        .writeText(invitationCode.code)
        .then(() => toast.success("Invitation code copied to clipboard!"))
        .catch((err) => console.error("Failed to copy text: ", err));
    }
  };

  const isExpired = (expiresAt: Date | null): boolean => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const daysUntilExpiration = invitationCode?.expiresAt
    ? differenceInDays(new Date(invitationCode.expiresAt), new Date())
    : null;

  if (!invitationCode || isExpired(invitationCode.expiresAt)) {
    return (
      <Card className="w-full h-fit">
        <CardHeader>
          <CardTitle>Project Invite</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            {!invitationCode
              ? "No invitation code found. Please generate a new one."
              : "The invitation code has expired. Please regenerate a new one."}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center gap-4">
          <Button
            variant="default"
            className="flex items-center gap-2"
            onClick={() => handleGenerate(projectId)}
            disabled={isPending}>
            {isPending ? (
              <>
                <LuRotateCw className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <LuRotateCw className="w-4 h-4" />
                Generate New Invitation Code
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full h-fit">
      <CardHeader>
        <CardTitle className="text-xl">Project Invite</CardTitle>
        <CardDescription>
          Share this code to invite new members.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-2">
        <div className="bg-primary/10 rounded-lg p-4 text-center">
          <span className="text-4xl font-mono font-bold text-primary">
            {invitationCode.code}
          </span>
        </div>
        {daysUntilExpiration !== null && (
          <span className="text-sm text-muted-foreground mt-2">
            {daysUntilExpiration > 0
              ? `Expires in ${daysUntilExpiration} days`
              : "Expires today"}
          </span>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          className="flex items-center gap-2 text-destructive"
          onClick={() => handleGenerate(projectId)}
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
