import { useCallback } from "react";
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

interface Props {
  projectId: string;
  project: Project;
}

const switchFormSchema = z.object({
  isPublic: projectSchema.shape.isPublic,
});

const project = {
  isPublic: true,
};

export default function ProjectVisibility({ projectId, project }: Props) {
  const switchForm = useForm<z.infer<typeof switchFormSchema>>({
    resolver: zodResolver(switchFormSchema),
    defaultValues: {
      isPublic: project.isPublic,
    },
  });

  const handleSwitchChange = useCallback(
    async (checked: boolean) => {
      try {
        // Update the form state
        switchForm.setValue("isPublic", checked);

        // Perform any async operation here, e.g., API call
        // await updateProjectVisibility(projectId, checked);

        toast.success(
          checked ? "Project is now public" : "Project is now private"
        );
      } catch (error) {
        console.error("Error updating project visibility:", error);
        toast.error("Failed to update project visibility");
        // Revert the switch state if the operation failed
        switchForm.setValue("isPublic", !checked);
      }
    },
    [switchForm]
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
                        Make project public
                      </FormLabel>
                      <FormDescription>
                        Allow anyone with the link to view this project
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={handleSwitchChange}
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
