"use client";

import { Button } from "@/components/ui/button";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectFormValues, projectSchema } from "@/lib/schema/ProjectSchema";
import { fetchProject } from "@/lib/api/projects";
import NoProjectFound from "../components/no-project-found";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { z } from "zod";

const switchFormSchema = z.object({
  isPublic: projectSchema.shape.isPublic,
});

export default function Settings({
  params,
}: {
  params: { projectId: string };
}) {
  const projectId = params.projectId;
  const queryClient = useQueryClient();

  const {
    data: project,
    isLoading: projectIsLoading,
    error: projectError,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(projectId),
    enabled: !!projectId,
  });

  const switchForm = useForm<z.infer<typeof switchFormSchema>>({
    resolver: zodResolver(switchFormSchema),
  });

  const {
    mutate: updateProject,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (values: ProjectFormValues) => {
      const options = {
        method: "PUT",
        body: JSON.stringify(values),
      };
      const response = await fetch("/api/projects", options);
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project", projectId],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // if (projectIsLoading) {
  //   return <Loading />;
  // }

  // if (!project) {
  //   return <NoProjectFound />;
  // }

  async function onSubmit(values: ProjectFormValues) {
    updateProject(values);
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

  function onSubmitSwitch(data: z.infer<typeof switchFormSchema>) {
    toast.success("Hi yall");
  }

  return (
    <>
      <main className="flex flex-1 flex-col p-4 lg:pt-4 lg:ml-[260px]">
        <div className="text-2xl font-bold tracking-tight">
          Go concurrency model Settings
        </div>
        <div className="flex flex-col-reverse lg:flex-row gap-4 items-start mt-2">
          <div className="w-full flex flex-col gap-4">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-xl">Project Visibility</CardTitle>
                <CardDescription>
                  Control who can see your project.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Form {...switchForm}>
                    <form
                      onSubmit={switchForm.handleSubmit(onSubmitSwitch)}
                      className="w-full space-y-6">
                      <FormField
                        control={switchForm.control}
                        name="isPublic"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Make project public{" "}
                              </FormLabel>
                              <FormDescription>
                                Allow anyone with the link to view this project
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button type="submit">Submit</Button>
                    </form>
                  </Form>
                </div>
              </CardContent>
            </Card>

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
