import Layout from "@/app/(main)/components/main-layout";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
