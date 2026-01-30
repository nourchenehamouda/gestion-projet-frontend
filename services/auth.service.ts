import { apiRequest } from "@/services/api";
import { setToken, removeToken } from "@/services/token";
import type { User } from "@/utils/types";

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
};

export async function login(payload: LoginPayload) {
  // Retourne la réponse brute du backend (doit contenir {id, name, email, role, token})
  return await apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function logout() {
  // Supprimer le token local
  removeToken();
  // Appeler le backend (optionnel)
  try {
    await apiRequest<void>("/auth/logout", { method: "POST" });
  } catch {
    // Ignorer les erreurs de logout
  }
}

export async function me() {
  return apiRequest<User>("/auth/me");
}
