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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LuClipboard } from "react-icons/lu";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { fetchProject } from "@/lib/api/projects";
import NoProjectFound from "../components/no-project-found";
import { useState } from "react";
import UpdateProjectDetails from "./components/update-project-details";
import ProjectVisibility from "./components/project-visibilty";

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

  // if (!project) {
  //   return <NoProjectFound />;
  // }

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
            <UpdateProjectDetails projectId={projectId} />
            <ProjectVisibility />

            <Card className="border-red-300 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-destructive">
                  Danger Zone
                </CardTitle>
              </CardHeader>

              <CardContent>
                {/* Leave Project */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 border-t border-gray-200">
                  <div className="mb-2 sm:mb-0 text-left">
                    <h3 className="text-sm font-medium">Leave Project</h3>
                    <p className="text-sm text-gray-500">
                      You will lose access to this project
                    </p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500">
                        Leave Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader className="text-left">
                        <DialogTitle>
                          Are you sure you want to leave this project?
                        </DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. You will lose all access
                          to this project.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-end gap-2 mt-4">
                        <DialogClose asChild>
                          <Button variant="outline" size="sm">
                            Close
                          </Button>
                        </DialogClose>
                        <Button variant="destructive" size="sm">
                          Leave Project
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Delete Project */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 border-t border-gray-200">
                  <div className="mb-2 sm:mb-0 text-left">
                    <h3 className="text-sm font-medium">Delete project</h3>
                    <p className="text-sm text-gray-500">
                      Once you delete a project, there is no going back.
                    </p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="self-start sm:self-center">
                        Delete Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader className="text-left">
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently
                          delete the project and remove all associated data.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-end gap-2 mt-4">
                        <DialogClose asChild>
                          <Button variant="outline" size="sm">
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button variant="destructive" size="sm">
                          Delete Project
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
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
