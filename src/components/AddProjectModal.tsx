"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ProjectFormValues,
  projectFormSchema,
} from "@/lib/schema/ProjectSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { LuFolderPlus } from "react-icons/lu";

export default function AddProjectModal() {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
  });
  const [isDialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const toggleDialog = () => {
    setDialogOpen(!isDialogOpen);
  };

  const {
    mutate: addProject,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (values: ProjectFormValues) => {
      const options = {
        method: "POST",
        body: JSON.stringify(values),
      };
      const response = await fetch("/api/projects", options);
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  async function onSubmit(values: ProjectFormValues) {
    addProject(values);
    toggleDialog();
    router.refresh();
  }
  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={toggleDialog}>
        <DialogTrigger asChild>
          <Button size="sm" className="flex items-center space-x-2 rounded-3xl">
            <LuFolderPlus className="w-5 h-5 text-white" />
            <span>New Project</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Project</DialogTitle>
            {/* <DialogDescription>
              Make changes to your profile here. Click save when you are done.
            </DialogDescription> */}

            <Form {...form}>
              <form
                className="space-y-3 pt-4 px-3"
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
                              required
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
                            defaultValue={field.value}
                            required>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="LIVE">Live</SelectItem>
                              <SelectItem value="BUILDING">Building</SelectItem>
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
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">Save Project</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
