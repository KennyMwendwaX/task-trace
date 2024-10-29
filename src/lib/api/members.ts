import axios from "axios";
import { Member } from "../schema/MemberSchema";

export const fetchProjectMembers = async (projectId: string) => {
  if (!projectId) throw new Error("No project ID");
  try {
    const { data } = await axios.get<{ members: Member[] }>(
      `/api/projects/${projectId}/members`
    );
    return data.members
      .map((member) => ({
        ...member,
        createdAt: new Date(member.createdAt),
        updatedAt: member.updatedAt ? new Date(member.updatedAt) : null,
        tasks: member.tasks.map((task) => ({
          ...task,
          dueDate: new Date(task.dueDate),
          createdAt: new Date(task.createdAt),
          updatedAt: task.updatedAt ? new Date(task.updatedAt) : null,
        })),
      }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch project members: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};
