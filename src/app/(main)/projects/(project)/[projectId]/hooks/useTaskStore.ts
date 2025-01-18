import { create } from "zustand";
import { ProjectTask } from "@/lib/schema/TaskSchema";

interface TaskState {
  task: ProjectTask | null;
  setTask: (task: ProjectTask) => void;
  clearTask: () => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  task: null,
  setTask: (task) => set({ task }),
  clearTask: () => set({ task: null }),
}));
