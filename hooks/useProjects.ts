"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  updateProject,
} from "@/services/project.service";
import { mockProjects } from "@/utils/constants";
import type { Project } from "@/utils/types";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    initialData: mockProjects,
  });
}

export function useProject(projectId: string) {
  return useQuery({
    queryKey: ["projects", projectId],
    queryFn: () => getProject(projectId),
    initialData: mockProjects.find((project) => project.id === projectId),
  });
}

export function useProjectActions() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: (project) => {
      queryClient.setQueryData<Project[]>(["projects"], (old) =>
        old ? [project, ...old] : [project],
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Project> }) =>
      updateProject(id, payload),
    onSuccess: (project) => {
      queryClient.setQueryData<Project[]>(["projects"], (old) =>
        old ? old.map((item) => (item.id === project.id ? project : item)) : [],
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: (_, id) => {
      queryClient.setQueryData<Project[]>(["projects"], (old) =>
        old ? old.filter((item) => item.id !== id) : [],
      );
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
