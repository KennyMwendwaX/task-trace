import { auth } from "../../auth";

export default async function Dashboard() {
  const session = await auth();
  return (
    <>
      <div className="text-2xl font-bold tracking-tight">
        Project was not found
      </div>
    </>
  );
}
