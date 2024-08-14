import { ExtendedProject } from "@/lib/schema/ProjectSchema";
import { UserTask } from "@/lib/schema/TaskSchema";
import { User } from "@/lib/schema/UserSchema";
import { create } from "zustand";

interface UserStore {
  users: User[];
  projects: ExtendedProject[];
  tasks: UserTask[];
  setUsers: (users: User[]) => void;
  setUserProjects: (projects: ExtendedProject[]) => void;
  setUserTasks: (tasks: UserTask[]) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  projects: [],
  tasks: [],
  setUsers: (users) => set({ users }),
  setUserProjects: (projects) => set({ projects }),
  setUserTasks: (tasks) => set({ tasks }),
}));
