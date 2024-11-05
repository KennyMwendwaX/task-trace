import ProjectLayoutWrapper from "./components/layout-wrapper";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProjectLayoutWrapper>{children}</ProjectLayoutWrapper>;
}
