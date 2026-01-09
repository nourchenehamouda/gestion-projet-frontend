"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, getUsers, updateUser } from "@/services/user.service";
import { mockUsers } from "@/utils/constants";
import type { User } from "@/utils/types";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    initialData: mockUsers,
  });
}

export function useUserActions() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: (user) => {
      queryClient.setQueryData<User[]>(["users"], (old) =>
        old ? [user, ...old] : [user],
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<User> }) =>
      updateUser(id, payload),
    onSuccess: (user) => {
      queryClient.setQueryData<User[]>(["users"], (old) =>
        old ? old.map((item) => (item.id === user.id ? user : item)) : [],
      );
    },
  });

  return {
    createMutation,
    updateMutation,
  };
}
