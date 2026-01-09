"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login, logout, me } from "@/services/auth.service";
import { ApiError } from "@/services/api";
import { roleRedirects } from "@/utils/roles";
import type { Role, User } from "@/utils/types";

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        return await me();
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          return null;
        }
        throw error;
      }
    },
    staleTime: 1000 * 60,
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.setQueryData(["me"], data.user);
      router.push(roleRedirects[data.user.role]);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["me"], null);
      queryClient.invalidateQueries({ queryKey: ["me"] });
      router.push("/login");
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
