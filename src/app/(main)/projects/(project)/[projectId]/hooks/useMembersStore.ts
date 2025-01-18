import { Member } from "@/lib/schema/MemberSchema";
import { create } from "zustand";

interface MembersState {
  members: Member[];
  setMembers: (members: Member[]) => void;
  clearMembers: () => void;
}

export const useMembersStore = create<MembersState>((set) => ({
  members: [],
  setMembers: (members) => set({ members }),
  clearMembers: () => set({ members: [] }),
}));
