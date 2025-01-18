import { create } from "zustand";
import { ProjectTask } from "@/lib/schema/TaskSchema";

interface TasksState {
  tasks: ProjectTask[];
  setTasks: (tasks: ProjectTask[]) => void;
  clearTasks: () => void;
}

export const useTasksStore = create<TasksState>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  clearTasks: () => set({ tasks: [] }),
}));
