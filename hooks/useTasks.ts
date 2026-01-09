"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTask, getTasks, updateTask } from "@/services/task.service";
import { mockTasks } from "@/utils/constants";
import type { Task } from "@/utils/types";

export function useTasks(projectId: string) {
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => getTasks(projectId),
    initialData: mockTasks.filter((task) => task.projectId === projectId),
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
      updateTask(id, payload),
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
