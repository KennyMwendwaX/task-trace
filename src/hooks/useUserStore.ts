import { MembershipRequests } from "@/lib/schema/MembershipRequests";
import { UserProject } from "@/lib/schema/ProjectSchema";
import { UserTask } from "@/lib/schema/TaskSchema";
import { User } from "@/lib/schema/UserSchema";
import { create } from "zustand";

interface UserStore {
  users: User[];
  projects: UserProject[];
  tasks: UserTask[];
  requests: MembershipRequests[];
  setUsers: (users: User[]) => void;
  setUserProjects: (projects: UserProject[]) => void;
  setUserTasks: (tasks: UserTask[]) => void;
  setUserMembershipRequests: (requests: MembershipRequests[]) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  projects: [],
  tasks: [],
  requests: [],
  setUsers: (users) => set({ users }),
  setUserProjects: (projects) => set({ projects }),
  setUserTasks: (tasks) => set({ tasks }),
  setUserMembershipRequests: (requests) => set({ requests }),
}));
