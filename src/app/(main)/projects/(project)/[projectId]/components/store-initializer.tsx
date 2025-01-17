"use client";

import { DetailedProject } from "@/lib/schema/ProjectSchema";
import { ReactNode, useRef } from "react";
import { useProjectStore } from "../hooks/useProjectStore";

export default function StoreInitializer({
  children,
  project,
}: {
  children: ReactNode;
  project: DetailedProject;
}) {
  const initialized = useRef(false);

  if (!initialized.current) {
    useProjectStore.getState().setProject(project);
    initialized.current = true;
  }

  return children;
}
