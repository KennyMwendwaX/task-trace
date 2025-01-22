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
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProject } from "@/server/actions/project/project";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface Props {
  userId: string;
  project: Project;
}

export default function UpdateProjectDetails({ userId, project }: Props) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: project,
  });

  const toggleDialog = () => {
    setDialogOpen(!isDialogOpen);
  };

  const onSubmit = (values: ProjectFormValues) => {
    startTransition(async () => {
      const result = await updateProject(userId, project.id, values);

      if (result.error) {
        switch (result.error.type) {
          case "UNAUTHORIZED":
            toast.error("You do not have permission to update this project");
            break;
          case "DATABASE_ERROR":
            toast.error("Failed to update project. Please try again");
            break;
          case "NOT_FOUND":
            toast.error("Project not found");
            break;
          default:
            toast.error("An unexpected error occurred");
        }
        return;
      }

      if (result.success) {
        form.reset();
        toggleDialog();
        toast.success("Project updated successfully!");
        router.refresh();
      }
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={toggleDialog}>
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
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={isPending}>
              {isPending ? (
                <>
                  <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Project"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
