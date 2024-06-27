import { projectData } from "../components/project";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Settings({
  params,
}: {
  params: { projectId: string };
}) {
  const projectId = params.projectId;
  const project = projectData;

  return (
    <>
      <main className="flex flex-1 flex-col p-4 lg:pt-4 lg:ml-[260px]">
        <Card>
          <CardHeader>
            <CardTitle>Update Project Name</CardTitle>
            <CardDescription>
              Only the owner or admins can update the project name.{" "}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <Input placeholder={project.name} />
            </form>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button>Update</Button>
          </CardFooter>
        </Card>
      </main>
    </>
  );
}
