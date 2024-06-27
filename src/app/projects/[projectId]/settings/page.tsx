"use client";

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
import { LuClipboard } from "react-icons/lu";
import { toast } from "sonner";

export default function Settings({
  params,
}: {
  params: { projectId: string };
}) {
  const projectId = params.projectId;
  const project = projectData;
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
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Project Invite</CardTitle>
            <CardDescription>
              Share this code to invite new members to your project.
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
          <CardFooter className="border-t flex items-center justify-between py-2">
            <Button className="flex items-center gap-1" onClick={handleCopy}>
              <LuClipboard className="w-4 h-4" />
              Copy
            </Button>
            <Button variant="outline" className="text-red-500">
              Regenerate Code
            </Button>
          </CardFooter>
        </Card>
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
