import { apiRequest } from "@/services/api";
import type { User } from "@/utils/types";

type UserPayload = {
  name: string;
  email: string;
  role: User["role"];
  password: string;
  isActive?: boolean;
};

export async function getUsers() {
  return apiRequest<User[]>("/users");
}

export async function createUser(payload: UserPayload) {
  return apiRequest<User>("/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateUser(id: string, payload: Partial<UserPayload>) {
  return apiRequest<User>(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
