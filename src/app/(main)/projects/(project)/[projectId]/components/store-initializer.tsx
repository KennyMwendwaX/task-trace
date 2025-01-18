"use client";

import { DetailedProject } from "@/lib/schema/ProjectSchema";
import { ReactNode, useRef } from "react";
import { useProjectStore } from "../hooks/useProjectStore";
import { Member } from "@/lib/schema/MemberSchema";
import { ProjectTask } from "@/lib/schema/TaskSchema";
import { useMembersStore } from "../hooks/useMembersStore";
import { useTasksStore } from "../hooks/useTasksStore";

type Props = {
  children: ReactNode;
  project: DetailedProject;
  members: Member[];
  tasks: ProjectTask[];
};

export default function StoreInitializer({
  children,
  project,
  members,
  tasks,
}: Props) {
  const initialized = useRef(false);

  if (!initialized.current) {
    useProjectStore.getState().setProject(project);
    useMembersStore.getState().setMembers(members);
    useTasksStore.getState().setTasks(tasks);
    initialized.current = true;
  }

  return children;
}
