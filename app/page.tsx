import TaskOverview from "@/components/TaskOverview";
import TaskChart from "@/components/TaskChart";
import LatestTasks from "@/components/LatestTasks";

export default function Home() {
  return (
    <>
      <div className="container mx-auto mt-4 px-8 pb-5 pt-12">
        <h2 className="text-3xl font-bold tracking-tight pb-2">Dashboard</h2>
        <TaskOverview />
        <div className="flex space-x-4 items-start pt-5">
          <TaskChart />
          <LatestTasks />
        </div>
      </div>
    </>
  );
}
