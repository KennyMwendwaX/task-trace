import { auth } from "@/auth";

export default async function Dashboard() {
  const session = await auth();
  return (
    <>
      <div className="container mx-auto mt-4 px-12 pb-5 pt-12">
        {JSON.stringify(session?.user)}
      </div>
    </>
  );
}
