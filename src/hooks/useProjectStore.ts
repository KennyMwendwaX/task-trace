import { Member } from "@/lib/schema/MemberSchema";
import { Project } from "@/lib/schema/ProjectSchema";
import { ProjectTask, UserTask } from "@/lib/schema/TaskSchema";
import { create } from "zustand";

interface ProjectStore {
  project: Project | null;
  projects: Project[];
  members: Member[];
  task: ProjectTask | null;
  tasks: ProjectTask[];
  invitationCode: string | null;
  setProject: (project: Project) => void;
  setProjects: (projects: Project[]) => void;
  setMembers: (members: Member[]) => void;
  setProjectTask: (task: ProjectTask) => void;
  setProjectTasks: (tasks: ProjectTask[]) => void;
  setInvitationCode: (invitationCode: string) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  project: null,
  projects: [],
  members: [],
  task: null,
  tasks: [],
  invitationCode: null,
  setProject: (project) => set({ project }),
  setProjects: (projects) => set({ projects }),
  setMembers: (members) => set({ members }),
  setProjectTask: (task) => set({ task }),
  setProjectTasks: (tasks) => set({ tasks }),
  setInvitationCode: (invitationCode) => set({ invitationCode }),
}));
