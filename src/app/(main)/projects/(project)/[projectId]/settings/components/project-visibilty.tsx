import { useCallback, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
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
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Project, projectSchema } from "@/lib/schema/ProjectSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { toggleProjectVisibility } from "@/server/actions/project/project";

interface Props {
  project: Project;
}

const switchFormSchema = z.object({
  isPublic: projectSchema.shape.isPublic,
});

export default function ProjectVisibility({ project }: Props) {
  const switchForm = useForm<z.infer<typeof switchFormSchema>>({
    resolver: zodResolver(switchFormSchema),
    defaultValues: {
      isPublic: project.isPublic,
    },
  });

  const [isPending, startTransition] = useTransition();

  const handleSwitchChange = useCallback(
    (checked: boolean) => {
      startTransition(async () => {
        const result = await toggleProjectVisibility(project.id, checked);

        if (result.error) {
          switch (result.error.type) {
            case "UNAUTHORIZED":
              toast.error("You must be logged in to update project visibility");
              break;
            case "FORBIDDEN":
              toast.error("You don't have permission to update this project");
              break;
            case "NOT_FOUND":
              toast.error("Project not found");
              break;
            case "DATABASE_ERROR":
              toast.error("Failed to update project visibility");
              break;
            default:
              toast.error("An unexpected error occurred");
          }
          return;
        }

        toast.success(
          checked ? "Project is now public" : "Project is now private"
        );
      });
    },
    [project.id]
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Project Visibility</CardTitle>
        <CardDescription>Control who can see your project.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Form {...switchForm}>
            <form className="w-full space-y-6">
              <FormField
                control={switchForm.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {field.value
                          ? "Toggle to make project private"
                          : "Toggle to make project public"}
                      </FormLabel>
                      <FormDescription>
                        {field.value
                          ? "Anyone with the invitation code will be able to access the project"
                          : "Anyone will be able to access the project"}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={handleSwitchChange}
                        disabled={isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
