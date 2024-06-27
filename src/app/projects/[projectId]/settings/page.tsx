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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { LuClipboard } from "react-icons/lu";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectData } from "../components/project";
import {
  Project,
  ProjectFormValues,
  projectFormSchema,
} from "@/lib/schema/ProjectSchema";

export default function Settings({
  params,
}: {
  params: { projectId: string };
}) {
  const project: Project = {
    ...projectData,
    status: projectData.status as "BUILDING" | "LIVE",
    createdAt: new Date(projectData.createdAt),
    updatedAt: new Date(projectData.updatedAt),
  };
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: project.name,
      status: project.status,
      description: project.description,
    },
  });
  const queryClient = useQueryClient();
  const router = useRouter();

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

  async function onSubmit(values: ProjectFormValues) {
    updateProject(values);
  }
  const projectId = params.projectId;
  const code = "ABCD1234FEDF";

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
        <div className="flex flex-col-reverse lg:flex-row gap-4 items-start">
          <div className="w-full flex flex-col gap-4">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-xl">
                  Update Project Details
                </CardTitle>
                <CardDescription>
                  Only the owner or admins can update the project details.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    className="space-y-3 pt-2 px-3"
                    onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid md:grid-cols-2 md:gap-6">
                      <div className="relative">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Project Name</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  id="name"
                                  className="focus:border-2 focus:border-blue-600"
                                  placeholder="Project name"
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="relative">
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Project Status</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value || undefined}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="LIVE">Live</SelectItem>
                                  <SelectItem value="BUILDING">
                                    Building
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                id="description"
                                className="focus:border-2 focus:border-blue-600"
                                placeholder="Project description"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button size="sm" type="submit">
                      Update Project
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            <Card className="w-full border-destructive">
              <CardHeader>
                <CardTitle className="text-xl">Delete Project</CardTitle>
                <CardDescription>
                  The project will be permanently deleted. This action is
                  irreversible and can not be undone.
                </CardDescription>
              </CardHeader>
              <CardFooter className="bg-red-50 border-t border-t-destructive flex justify-between py-2.5 rounded-b-lg">
                <Button variant="destructive" size="sm" onClick={handleCopy}>
                  Delete
                </Button>
              </CardFooter>
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
