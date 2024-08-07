import axios from "axios";
import { User } from "../schema/UserSchema";

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const { data } = await axios.get<{ users: User[] }>("/api/users");
    return data.users.map((user) => ({
      ...user,
      createdAt: new Date(user.createdAt),
      updatedAt: user.updatedAt ? new Date(user.updatedAt) : null,
    }));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};
