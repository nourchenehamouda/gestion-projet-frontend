import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, getUsers, updateUser } from "@/services/user.service";

import { useAuth } from "@/hooks/useAuth";

export function useUsers() {
  const { role } = useAuth();
  const shouldFetch = role === "ADMIN" || role === "PROJECT_MANAGER";
  return useQuery({
    queryKey: ["users"],
    queryFn: shouldFetch ? getUsers : async () => [],
    enabled: shouldFetch,
  });
}

export function useUserActions() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => {
      console.error("Create user error:", err);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => {
      console.error("Update user error:", err);
    },
  });

  return { createMutation, updateMutation };
}
