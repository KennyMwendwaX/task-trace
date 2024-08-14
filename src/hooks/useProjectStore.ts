import { Member } from "@/lib/schema/MemberSchema";
import { Project } from "@/lib/schema/ProjectSchema";
import { ProjectTask, UserTask } from "@/lib/schema/TaskSchema";
import { create } from "zustand";

interface ProjectStore {
  project: Project | null;
  publicProjects: Project[];
  members: Member[];
  tasks: ProjectTask[];
  setProject: (project: Project) => void;
  setPublicProjects: (projects: Project[]) => void;
  setMembers: (members: Member[]) => void;
  setProjectTasks: (tasks: ProjectTask[]) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  project: null,
  publicProjects: [],
  members: [],
  tasks: [],
  setProject: (project) => set({ project }),
  setPublicProjects: (publicProjects) => set({ publicProjects }),
  setMembers: (members) => set({ members }),
  setProjectTasks: (tasks) => set({ tasks }),
}));
