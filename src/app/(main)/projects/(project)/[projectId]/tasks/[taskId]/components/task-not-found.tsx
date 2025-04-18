"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LuChevronLeft } from "react-icons/lu";
import { BsListTask } from "react-icons/bs";

interface Props {
  projectId: string;
}

export default function TaskNotFound({ projectId }: Props) {
  const router = useRouter();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0 items-center justify-center">
      <div className="flex flex-col items-center gap-1 text-center">
        <div className="bg-gray-100 rounded-full p-4 inline-block mb-4">
          <BsListTask className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">No Task Found</h2>
        <p className="text-gray-600 mb-4">
          The task you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <div className="flex justify-center">
          <Button
            size="lg"
            variant="default"
            className="flex items-center justify-center gap-2 rounded-full"
            onClick={() => router.push(`/projects/${projectId}/tasks`)}>
            <LuChevronLeft className="w-5 h-5" />
            Go Back to Tasks
          </Button>
        </div>
      </div>
    </main>
  );
}
