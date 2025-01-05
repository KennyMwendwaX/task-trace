import { redirect } from "next/navigation";
import ProjectsContent from "./components/projects-content";
import { Suspense } from "react";
import Loading from "./loading";
import { auth } from "@/auth";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams?: { search?: string };
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <Suspense fallback={<Loading />}>
      <ProjectsContent userId={session.user.id} searchParams={searchParams} />
    </Suspense>
  );
}
