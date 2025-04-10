import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import StoreInitializer from "./components/store-initializer";
import { getTask } from "@/server/api/project/tasks";

export const metadata: Metadata = {
  title: "Task",
  description: "Task page",
};

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{
    projectId: string;
    taskId: string;
  }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/sign-in");
  }

  const { projectId, taskId } = await params;
  const taskResult = await getTask(projectId, taskId);
  if (taskResult.error) {
    throw new Error(taskResult.error.message);
  }

  const task = taskResult.data;

  if (!task) {
    notFound();
  }

  return <StoreInitializer task={task}>{children}</StoreInitializer>;
}
