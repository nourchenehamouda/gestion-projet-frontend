"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login, logout, me } from "@/services/auth.service";
import { getToken, setToken, removeToken } from "@/services/token";
import { roleRedirects } from "@/utils/roles";
import type { Role, User } from "@/utils/types";

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const meQuery = useQuery({
    queryKey: ["me", getToken()],
    queryFn: async () => {
      const token = getToken();
      if (!token) return null;
      try {
        return await me();
      } catch (error: any) {
        if (error && (error.status === 401 || error.code === 401)) {
          removeToken();
          return null;
        }
        throw error;
      }
    },
    staleTime: 1000 * 60,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      removeToken();
      setToken(data.token);
      await queryClient.removeQueries({ queryKey: ["me"] });

      let normalizedRole = String(data.role || "").toUpperCase().replace(/\s+/g, "_");
      if (normalizedRole === "CHEF_DE_PROJET" || normalizedRole === "CHEF_PROJET") normalizedRole = "PROJECT_MANAGER";
      if (normalizedRole === "EMPLOYE") normalizedRole = "EMPLOYEE";
      if (normalizedRole === "ADMINISTRATEUR") normalizedRole = "ADMIN";
      if (normalizedRole === "CLIENTE") normalizedRole = "CLIENT";

      const redirect = roleRedirects[normalizedRole as Role] || "/";
      router.push(redirect);
    },
    onError: (error) => {
      // Login error
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["me"], null);
      queryClient.removeQueries({ queryKey: ["me"] });
      window.location.href = "/login";
    },
  });

  const user = (meQuery.data ?? null) as User | null;
  const role = user?.role ?? null;

  return {
    user,
    role,
    isLoading: meQuery.isLoading,
    isAuthenticated: Boolean(user),
    error: meQuery.error,
    login: loginMutation,
    logout: logoutMutation,
  };
}

export function isAdmin(role?: Role | null) {
  return role === "ADMIN";
}
