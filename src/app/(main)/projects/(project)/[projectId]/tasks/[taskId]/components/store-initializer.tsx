"use client";

import { ReactNode, useRef } from "react";
import { useProjectStore } from "../hooks/useProjectStore";
import { ProjectTask } from "@/lib/schema/TaskSchema";

export default function StoreInitializer({
  children,
  task,
}: {
  children: ReactNode;
  task: ProjectTask;
}) {
  const initialized = useRef(false);

  if (!initialized.current) {
    useProjectStore.getState().setProject(task);
    initialized.current = true;
  }

  return children;
}
