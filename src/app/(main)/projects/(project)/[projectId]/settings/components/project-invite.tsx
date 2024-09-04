import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { toast } from "@/components/ui/use-toast";
import { InvitationCode } from "@/lib/schema/InvitationCodeSchema";

interface ProjectInviteProps {
  projectId: string;
  invitationCode: InvitationCode | null;
}

const getInvitationCode = async (projectId: string) => {
  const response = await fetch(`/api/projects/${projectId}/invitation-code`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to get invitation code.");
  }
  return response.json();
};

const generateInvitationCode = async (projectId: string) => {
  const response = await fetch(`/api/projects/${projectId}/invitation-code`, {
    method: "POST",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to generate invitation code.");
  }
  return response.json();
};

export default function ProjectInvite({ projectId }: ProjectInviteProps) {
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["invitation-code", projectId],
    queryFn: () => getInvitationCode(projectId),
    onError: (err: Error) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const regenerateCodeMutation = useMutation({
    mutationFn: () => generateInvitationCode(projectId),
    onSuccess: (data) => {
      setIsGenerating(false);
      toast({
        title: "Success",
        description: "Invitation code regenerated.",
      });
      queryClient.setQueryData(["invitation-code", projectId], data);
    },
    onError: (err: Error) => {
      setIsGenerating(false);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const handleCopy = () => {
    if (data?.code) {
      navigator.clipboard
        .writeText(data.code)
        .then(() =>
          toast({
            title: "Success",
            description: "Invitation code copied to clipboard!",
          })
        )
        .catch((err) => console.error("Failed to copy text: ", err));
    }
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    regenerateCodeMutation.mutate();
  };

  if (isLoading) {
    return (
      <Card className="w-full h-fit">
        <CardHeader>
          <CardTitle className="text-xl">Project Invite</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="w-full h-fit">
        <CardHeader>
          <CardTitle className="text-xl">Project Invite</CardTitle>
          <CardDescription>Error: {(error as Error)?.message}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data?.code) {
    return (
      <Card className="w-full h-fit">
        <CardHeader>
          <CardTitle className="text-xl">Project Invite</CardTitle>
          <CardDescription>
            No invitation code found. Please generate a new one.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button
            variant="primary"
            className="flex items-center gap-2"
            onClick={handleRegenerate}
            disabled={isGenerating}>
            <LuRotateCw className="w-4 h-4" />
            {isGenerating ? "Generating..." : "Generate Invitation Code"}
          </Button>
        </CardContent>
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
      <CardContent className="flex flex-col items-center justify-center gap-4">
        <div className="bg-primary/10 rounded-lg p-4 text-center">
          <p className="text-4xl font-mono font-bold text-primary">
            {data.code}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Expires in{" "}
            {Math.floor(
              (data.expiresAt - new Date().getTime()) / (1000 * 60 * 60 * 24)
            )}{" "}
            days
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          className="flex items-center gap-2 text-destructive"
          onClick={handleRegenerate}
          disabled={isGenerating}>
          <LuRotateCw className="w-4 h-4" />
          {isGenerating ? "Regenerating..." : "Regenerate"}
        </Button>
        <Button onClick={handleCopy} className="flex items-center gap-2">
          <LuClipboard className="w-4 h-4" />
          Copy Code
        </Button>
      </CardFooter>
    </Card>
  );
}
