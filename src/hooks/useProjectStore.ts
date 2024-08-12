import { Member } from "@/lib/schema/MemberSchema";
import { Project } from "@/lib/schema/ProjectSchema";
import { ProjectTask, UserTask } from "@/lib/schema/TaskSchema";
import { create } from "zustand";

interface ProjectStore {
  project: Project | null;
  members: Member[];
  userTasks: UserTask[];
  projectTasks: ProjectTask[];
  setProject: (project: Project) => void;
  setMembers: (members: Member[]) => void;
  //   setUserTasks: (userTasks: UserTask[]) => void;
  setProjectTasks: (projectTasks: ProjectTask[]) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  project: null,
  members: [],
  userTasks: [],
  projectTasks: [],
  setProject: (project) => set({ project }),
  setMembers: (members) => set({ members }),
  //   setUserTasks: (userTasks) => set({ userTasks }),
  setProjectTasks: (projectTasks) => set({ projectTasks }),
}));
