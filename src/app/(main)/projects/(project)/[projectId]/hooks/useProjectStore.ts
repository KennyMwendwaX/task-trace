import { create } from "zustand";
import { DetailedProject } from "@/lib/schema/ProjectSchema";

interface ProjectState {
  project: DetailedProject | null;
  setProject: (project: DetailedProject) => void;
  clearProject: () => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  project: null,
  setProject: (project) => set({ project }),
  clearProject: () => set({ project: null }),
}));
