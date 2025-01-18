"use client";

import { ReactNode, useRef } from "react";
import { useTaskStore } from "../../../hooks/useTaskStore";
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
    useTaskStore.getState().setTask(task);
    initialized.current = true;
  }

  return children;
}
