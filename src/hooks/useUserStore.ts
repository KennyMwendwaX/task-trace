import { UserMembershipRequest } from "@/lib/schema/MembershipRequests";
import { MemberProject } from "@/lib/schema/ProjectSchema";
import { UserTask } from "@/lib/schema/TaskSchema";
import { create } from "zustand";

interface UserStore {
  projects: MemberProject[];
  tasks: UserTask[];
  requests: UserMembershipRequest[];
  setUserProjects: (projects: MemberProject[]) => void;
  setUserTasks: (tasks: UserTask[]) => void;
  setUserUserMembershipRequest: (requests: UserMembershipRequest[]) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  projects: [],
  tasks: [],
  requests: [],
  setUserProjects: (projects) => set({ projects }),
  setUserTasks: (tasks) => set({ tasks }),
  setUserUserMembershipRequest: (requests) => set({ requests }),
}));
