"use client";

import { Button } from "@/components/ui/button";
import { LuChevronLeft } from "react-icons/lu";
import { MdOutlineErrorOutline } from "react-icons/md";
import { useRouter } from "next/navigation";

interface ServerErrorProps {
  title: string;
  message: string;
  details?: string;
  returnPath?: string;
  returnLabel?: string;
}

export function ServerError({
  title,
  message,
  details,
  returnPath = "/dashboard",
  returnLabel = "Return to Dashboard",
}: ServerErrorProps) {
  const router = useRouter();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0 items-center justify-center">
      <div className="flex flex-col items-center gap-1 text-center">
        <div className="bg-red-50 rounded-full p-4 inline-block mb-4">
          <MdOutlineErrorOutline className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-3xl font-bold mb-3">{title}</h2>
        <p className="mb-2">{message}</p>
        {details && <p className="text-sm mb-4 max-w-md">{details}</p>}
        <div className="flex justify-center">
          <Button
            size="lg"
            variant="default"
            className="flex items-center justify-center gap-2 rounded-full"
            onClick={() => router.push(returnPath)}>
            <LuChevronLeft className="w-5 h-5" />
            {returnLabel}
          </Button>
        </div>
      </div>
    </main>
  );
}
