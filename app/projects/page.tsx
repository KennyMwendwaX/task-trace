import { Button } from "@/components/ui/button";

export default function Projects() {
  return (
    <>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center">
          <h1 className="font-semibold text-lg md:text-2xl">Projects</h1>
          <Button className="ml-auto" size="sm">
            New Project
          </Button>
        </div>
      </main>
    </>
  );
}
