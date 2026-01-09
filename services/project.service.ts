import { apiRequest } from "@/services/api";
import type { Project } from "@/utils/types";

type ProjectPayload = Omit<Project, "id" | "members">;

export async function getProjects() {
  return apiRequest<Project[]>("/projects");
}

export async function getProject(id: string) {
  return apiRequest<Project>(`/projects/${id}`);
}

export async function createProject(payload: ProjectPayload) {
  return apiRequest<Project>("/projects", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateProject(id: string, payload: Partial<ProjectPayload>) {
  return apiRequest<Project>(`/projects/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteProject(id: string) {
  return apiRequest<void>(`/projects/${id}`, {
    method: "DELETE",
  });
}
