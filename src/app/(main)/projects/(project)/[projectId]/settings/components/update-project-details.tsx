import { Button } from "@/components/ui/button";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Project,
  ProjectFormValues,
  projectFormSchema,
} from "@/lib/schema/ProjectSchema";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LuSettings } from "react-icons/lu";

interface Props {
  project: Project;
}

export default function UpdateProjectDetails({ project }: Props) {
  const queryClient = useQueryClient();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "Go concurrency model",
      status: "LIVE",
      description:
        "This is a cold world, but that is just a tip of the ice berg.",
    },
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
        queryKey: ["project", project.id],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  async function onSubmit(values: ProjectFormValues) {
    updateProject(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <LuSettings className="w-4 h-4" />
          Update Project Details
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-lg sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update Project Details</DialogTitle>
          <DialogDescription>
            Only the owner or admins can update the project details.
          </DialogDescription>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
}
