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

export default function ProjectVisibility() {
  const switchForm = useForm<z.infer<typeof switchFormSchema>>({
    resolver: zodResolver(switchFormSchema),
  });

  function onSubmitSwitch(data: z.infer<typeof switchFormSchema>) {
    toast.success("Hi yall");
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Project Visibility</CardTitle>
        <CardDescription>Control who can see your project.</CardDescription>
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
  );
}
