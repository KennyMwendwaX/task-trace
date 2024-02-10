import { auth } from "../../../auth";

export default async function Dashboard() {
  const session = await auth();
  return (
    <>
      <main className="p-4 md:ml-64 h-auto pt-20">
        {JSON.stringify(session?.user)}
      </main>
    </>
  );
}
