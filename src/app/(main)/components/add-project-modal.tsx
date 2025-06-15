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
import { useState, useTransition } from "react";
import {
  ProjectFormValues,
  projectFormSchema,
} from "@/lib/schema/ProjectSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../../components/ui/button";
import { LuFolderPlus } from "react-icons/lu";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { createProject } from "@/server/actions/user/projects";
import { tryCatch } from "@/lib/try-catch";

export default function AddProjectModal() {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
  });

  const router = useRouter();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const toggleDialog = () => {
    setDialogOpen(!isDialogOpen);
  };

  const onSubmit = (values: ProjectFormValues) => {
    startTransition(async () => {
      const { data, error: createProjectError } = await tryCatch(
        createProject(values)
      );

      if (createProjectError) {
        toast.error(createProjectError.message);
        return;
      }

      if (data.projectId) {
        form.reset();
        toggleDialog();
        toast.success("Project created successfully!");
        router.push(`/projects/${data.projectId}`);
      }
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={toggleDialog}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 rounded-3xl">
          <LuFolderPlus className="w-5 h-5" />
          <span>New Project</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-lg sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
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
                        placeholder="Project name"
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        <SelectTrigger className="w-full">
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
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      id="description"
                      placeholder="Project description"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="sm:justify-end">
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isPending}>
                {isPending ? (
                  <>
                    <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Project"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
