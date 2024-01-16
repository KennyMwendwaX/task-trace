import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Project page",
};

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: string };
}) {
  const projectId = params.projectId;

  const project = fetch(`/api/projects/${projectId}`);
  return (
    <>
      <div>{children}</div>;
    </>
  );
}
