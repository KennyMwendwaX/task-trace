import { Member } from "@/lib/schema/MemberSchema";
import { ExtendedProject, Project } from "@/lib/schema/ProjectSchema";
import { ProjectTask, UserTask } from "@/lib/schema/TaskSchema";
import { create } from "zustand";

interface ProjectStore {
  project: Project | null;
  publicProjects: Project[];
  members: Member[];
  userTasks: UserTask[];
  projectTasks: ProjectTask[];
  setProject: (project: Project) => void;
  setPublicProjects: (projects: Project[]) => void;
  setMembers: (members: Member[]) => void;
  //   setUserTasks: (userTasks: UserTask[]) => void;
  setProjectTasks: (projectTasks: ProjectTask[]) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  project: null,
  publicProjects: [],
  members: [],
  userTasks: [],
  projectTasks: [],
  setProject: (project) => set({ project }),
  setPublicProjects: (publicProjects) => set({ publicProjects }),
  setMembers: (members) => set({ members }),
  //   setUserTasks: (userTasks) => set({ userTasks }),
  setProjectTasks: (projectTasks) => set({ projectTasks }),
}));
