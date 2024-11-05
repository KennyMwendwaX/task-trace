import { UserMembershipRequest } from "@/lib/schema/MembershipRequests";
import { MemberProject } from "@/lib/schema/ProjectSchema";
import { UserTask } from "@/lib/schema/TaskSchema";
import { User } from "@/lib/schema/UserSchema";
import { create } from "zustand";

interface UserStore {
  users: User[];
  projects: MemberProject[];
  tasks: UserTask[];
  requests: UserMembershipRequest[];
  setUsers: (users: User[]) => void;
  setUserProjects: (projects: MemberProject[]) => void;
  setUserTasks: (tasks: UserTask[]) => void;
  setUserUserMembershipRequest: (requests: UserMembershipRequest[]) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  projects: [],
  tasks: [],
  requests: [],
  setUsers: (users) => set({ users }),
  setUserProjects: (projects) => set({ projects }),
  setUserTasks: (tasks) => set({ tasks }),
  setUserUserMembershipRequest: (requests) => set({ requests }),
}));
