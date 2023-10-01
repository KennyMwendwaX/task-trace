import TaskOverview from "@/components/TaskOverview";
import TaskChart from "@/components/TaskChart";

export default function Home() {
  return (
    <>
      <div className="container mx-auto mt-4 px-5 pb-5 pt-12">
        <h2 className="text-3xl font-bold tracking-tight pb-2">Dashboard</h2>
        <TaskOverview />
        <TaskChart />
      </div>
    </>
  );
}
