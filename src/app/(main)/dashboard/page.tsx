import { Suspense } from "react";
import DashboardContent from "./components/dashboard-content";
import Loading from "./loading";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <Suspense fallback={<Loading />}>
      <DashboardContent userId={session.user.id} userName={session.user.name} />
    </Suspense>
  );
}
