"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTask, getProjectTasks, updateTask } from "@/services/task.service";
import type { Task } from "@/utils/types";

export function useTasks(projectId: string) {
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => getProjectTasks(projectId),
  });
}

export function useTaskActions(projectId: string) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: (task) => {
      queryClient.setQueryData<Task[]>(["tasks", projectId], (old) =>
        old ? [task, ...old] : [task],
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Task> }) =>
      // Cast payload to any to bypass strict type check for now, or assume undefined vs null
      updateTask(id, payload as any),
    onSuccess: (task) => {
      queryClient.setQueryData<Task[]>(["tasks", projectId], (old) =>
        old ? old.map((item) => (item.id === task.id ? task : item)) : [],
      );
    },
  });

  return {
    createMutation,
    updateMutation,
  };
}
