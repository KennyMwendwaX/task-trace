import { ExtendedProject } from "@/lib/schema/ProjectSchema";
import { UserTask } from "@/lib/schema/TaskSchema";
import { User } from "@/lib/schema/UserSchema";
import { create } from "zustand";

interface UserStore {
  users: User[];
  userProjects: ExtendedProject[];
  userTasks: UserTask[];
  setUsers: (users: User[]) => void;
  setUserProjects: (userProjects: ExtendedProject[]) => void;
  setUserTasks: (userTasks: UserTask[]) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  userProjects: [],
  userTasks: [],
  setUsers: (users) => set({ users }),
  setUserProjects: (userProjects) => set({ userProjects }),
  setUserTasks: (userTasks) => set({ userTasks }),
}));
