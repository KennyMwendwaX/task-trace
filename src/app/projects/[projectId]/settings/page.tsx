"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LuClipboard } from "react-icons/lu";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { fetchProject } from "@/lib/api/projects";
import NoProjectFound from "../components/no-project-found";
import UpdateProjectDetails from "./components/update-project-details";
import ProjectVisibility from "./components/project-visibilty";
import DangerZone from "./components/danger-zone";

export default function Settings({
  params,
}: {
  params: { projectId: string };
}) {
  const projectId = params.projectId;

  const {
    data: project,
    isLoading: projectIsLoading,
    error: projectError,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(projectId),
    enabled: !!projectId,
  });

  // if (projectIsLoading) {
  //   return <Loading />;
  // }

  if (!project) {
    return <NoProjectFound />;
  }

  const code = "Tzq63nZSNe";

  const handleCopy = () => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        toast.success("Invitation code copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <>
      <main className="flex flex-1 flex-col p-4 lg:pt-4 lg:ml-[260px]">
        <div className="text-2xl font-bold tracking-tight">
          Go concurrency model Settings
        </div>
        <div className="flex flex-col-reverse lg:flex-row gap-4 items-start mt-2">
          <div className="w-full flex flex-col gap-4">
            <UpdateProjectDetails projectId={projectId} project={project} />
            <ProjectVisibility projectId={projectId} project={project} />
            <DangerZone />
          </div>

          <Card className="w-full lg:max-w-sm">
            <CardHeader>
              <CardTitle className="text-xl">Project Invite</CardTitle>
              <CardDescription>
                Share this code to invite new members to the project.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-3 pt-3">
              <div className="rounded-md bg-primary px-6 py-3 text-3xl font-bold text-primary-foreground">
                {code}
              </div>

              <p className="text-sm text-muted-foreground">
                This code will expire in 7 days.
              </p>
            </CardContent>
            <CardFooter className="border-t flex items-center justify-between py-2.5">
              <Button
                className="flex items-center gap-1"
                size="sm"
                onClick={handleCopy}>
                <LuClipboard className="w-4 h-4" />
                Copy
              </Button>
              <Button variant="outline" size="sm" className="text-red-500">
                Regenerate Code
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </>
  );
}
