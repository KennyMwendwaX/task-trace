"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LuChevronLeft } from "react-icons/lu";
import { MdOutlineFolderOff } from "react-icons/md";

export default function ProjectNotFound() {
  const router = useRouter();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0 items-center justify-center">
      <div className="flex flex-col items-center gap-1 text-center">
        <div className="rounded-full p-4 inline-block mb-4">
          <MdOutlineFolderOff className="h-12 w-12" />
        </div>
        <h2 className="text-3xl font-bold mb-3">No Project Found</h2>
        <p className="mb-4">
          The project you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <div className="flex justify-center">
          <Button
            size="lg"
            variant="default"
            className="flex items-center justify-center gap-2 rounded-full"
            onClick={() => router.push("/dashboard")}>
            <LuChevronLeft className="w-5 h-5" />
            Return to Dashboard
          </Button>
        </div>
      </div>
    </main>
  );
}
