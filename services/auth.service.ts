import { apiRequest } from "@/services/api";
import type { User } from "@/utils/types";

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  user: User;
};

export async function login(payload: LoginPayload) {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function logout() {
  return apiRequest<void>("/auth/logout", {
    method: "POST",
  });
}

export async function me() {
  return apiRequest<User>("/auth/me");
}
