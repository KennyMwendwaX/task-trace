import { auth } from "@/auth";
import Layout from "@/components/layout";
import SessionProvider from "@/providers/SessionProvider";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <Layout>{children}</Layout>
    </SessionProvider>
  );
}
