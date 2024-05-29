import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects page",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="container mx-auto px-8 py-4 bg-muted/40 min-h-screen md:px-10 lg:px-14">
      {children}
    </main>
  );
}
