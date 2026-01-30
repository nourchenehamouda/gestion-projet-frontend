"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProjects,
  getProjectById,
  getProjectTasks,
  createProject as createProjectApi,
  updateProject as updateProjectApi,
  deleteProject as deleteProjectApi,
  addMemberToProject,
} from "@/services/project.service";
import type { ProjectStatus } from "@/utils/types";

type CreateProjectPayload = {
  name: string;
  description?: string;
  status?: ProjectStatus;
  startDate?: string;
  endDate?: string;
};

type AddMemberPayload = {
  projectId: string;
  userIds: string[];
  roleInProject: string;
  taskTitle?: string;
};

export function useProjects() {
  const queryClient = useQueryClient();

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const create = useMutation({
    mutationFn: createProjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateProjectPayload> }) =>
      updateProjectApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const remove = useMutation({
    mutationFn: deleteProjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const addMember = useMutation({
    mutationFn: async ({ projectId, userIds, roleInProject }: AddMemberPayload) => {
      // Add all users in sequence
      for (const userId of userIds) {
        await addMemberToProject(projectId, userId, roleInProject);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  return {
    projects: projectsQuery.data ?? [],
    isLoading: projectsQuery.isLoading,
    error: projectsQuery.error,
    create,
    update,
    remove,
    addMember,
    // Backwards compatibility
    createProject: create,
    updateProject: update,
    deleteProject: remove,
  };
}

export function useProject(id: string) {
  const projectQuery = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectById(id),
    enabled: !!id,
  });

  const tasksQuery = useQuery({
    queryKey: ["project-tasks", id],
    queryFn: () => getProjectTasks(id),
    enabled: !!id,
  });

  return {
    project: projectQuery.data,
    tasks: (tasksQuery.data ?? []) as any[],
    isLoading: projectQuery.isLoading || tasksQuery.isLoading,
    error: projectQuery.error || tasksQuery.error,
  };
}
