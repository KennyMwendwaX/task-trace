import { InvitationCode } from "@/lib/schema/InvitationCodeSchema";
import { Member } from "@/lib/schema/MemberSchema";
import { ProjectMembershipRequest } from "@/lib/schema/MembershipRequests";
import { DetailedProject, PublicProject } from "@/lib/schema/ProjectSchema";
import { ProjectTask } from "@/lib/schema/TaskSchema";
import { create } from "zustand";

interface ProjectStore {
  project: DetailedProject | null;
  projects: PublicProject[];
  members: Member[];
  task: ProjectTask | null;
  tasks: ProjectTask[];
  invitationCode: InvitationCode | null;
  requests: ProjectMembershipRequest[];
  setProject: (project: DetailedProject) => void;
  setProjects: (projects: PublicProject[]) => void;
  setMembers: (members: Member[]) => void;
  setProjectTask: (task: ProjectTask) => void;
  setProjectTasks: (tasks: ProjectTask[]) => void;
  setInvitationCode: (invitationCode: InvitationCode) => void;
  setRequests: (requests: ProjectMembershipRequest[]) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  project: null,
  projects: [],
  members: [],
  task: null,
  tasks: [],
  invitationCode: null,
  requests: [],
  setProject: (project) => set({ project }),
  setProjects: (projects) => set({ projects }),
  setMembers: (members) => set({ members }),
  setProjectTask: (task) => set({ task }),
  setProjectTasks: (tasks) => set({ tasks }),
  setInvitationCode: (invitationCode) => set({ invitationCode }),
  setRequests: (requests) => set({ requests }),
}));
