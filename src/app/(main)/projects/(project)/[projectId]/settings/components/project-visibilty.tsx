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
import { projectSchema } from "@/lib/schema/ProjectSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { toggleProjectVisibility } from "@/server/api/project/project";
import { DetailedProject } from "@/database/schema";
import { tryCatch } from "@/lib/try-catch";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { FiGlobe, FiLock, FiInfo } from "react-icons/fi";

interface Props {
  project: DetailedProject;
}

const switchFormSchema = z.object({
  isPublic: projectSchema.shape.isPublic,
});

export default function ProjectVisibility({ project }: Props) {
  const router = useRouter();
  const switchForm = useForm<z.infer<typeof switchFormSchema>>({
    resolver: zodResolver(switchFormSchema),
    defaultValues: {
      isPublic: project.isPublic,
    },
  });

  const [isPending, startTransition] = useTransition();

  const handleSwitchChange = (checked: boolean) => {
    startTransition(async () => {
      const { data, error } = await tryCatch(
        toggleProjectVisibility(project.id, checked)
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.success === true) {
        toast.success(
          checked ? "Project is now public" : "Project is now private"
        );
      }
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            Project Visibility
          </CardTitle>
          <Badge
            variant={project.isPublic ? "secondary" : "outline"}
            className="flex items-center gap-1 px-3 py-1 ml-2">
            {project.isPublic ? (
              <>
                <FiGlobe className="w-3 h-3" />
                <span className="font-medium">Public</span>
              </>
            ) : (
              <>
                <FiLock className="w-3 h-3" />
                <span className="font-medium">Private</span>
              </>
            )}
          </Badge>
        </div>
        <CardDescription className="mt-1 text-sm">
          Control who can see your project.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <Form {...switchForm}>
            <form className="w-full">
              <FormField
                control={switchForm.control}
                name="isPublic"
                render={() => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-card transition-colors hover:bg-accent/5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {project.isPublic ? (
                          <FiGlobe className="w-4 h-4 text-blue-500" />
                        ) : (
                          <FiLock className="w-4 h-4 text-gray-500" />
                        )}
                        <FormLabel className="text-base font-medium">
                          {project.isPublic
                            ? "Toggle to make project private"
                            : "Toggle to make project public"}
                        </FormLabel>
                      </div>
                      <FormDescription className="flex items-start gap-1">
                        <FiInfo className="w-3 h-3 mt-1 flex-shrink-0 opacity-70" />
                        <span className="text-sm">
                          {project.isPublic
                            ? "Anyone with the invitation code will be able to access the project"
                            : "Anyone will be able to access the project"}
                        </span>
                      </FormDescription>
                    </div>
                    <FormControl>
                      <div className="flex flex-col items-end gap-1">
                        <Switch
                          checked={project.isPublic}
                          onCheckedChange={handleSwitchChange}
                          disabled={isPending}
                        />
                        {isPending && (
                          <span className="text-xs text-muted-foreground animate-pulse">
                            Updating...
                          </span>
                        )}
                      </div>
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
