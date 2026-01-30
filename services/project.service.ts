import { apiRequest } from "@/services/api";
import type { ProjectStatus } from "@/utils/types";
// Supprimer un projet
export function deleteProject(id: string) {
  return apiRequest(`/projects/${id}`, {
    method: "DELETE"
  });
}

export type CreateProjectPayload = {
  name: string;
  description?: string;
  status?: ProjectStatus;
  startDate?: string; // ISO yyyy-MM-dd
  endDate?: string;
  members?: {
    userId: string;
    roleInProject: string;
  }[];
};

export function getProjects() {
  return apiRequest("/projects");
}

export function getProjectById(id: string) {
  return apiRequest(`/projects/${id}`);
}

export function getProjectTasks(id: string) {
  return apiRequest(`/projects/${id}/tasks`);
}

export function updateProject(id: string, data: Partial<CreateProjectPayload>) {
  return apiRequest(`/projects/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// Nouvelle version : accepte soit (payload), soit ({payload, document})
export function createProject(
  arg: CreateProjectPayload | { payload: CreateProjectPayload; document: File }
) {
  // Si document, on attend un objet { payload, document }
  if (typeof arg === "object" && "document" in arg) {
    const { payload, document } = arg;
    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));
    formData.append("document", document);
    // Log pour vérifier le contenu de FormData
    console.log("FormData entries:", [...formData.entries()]);
    // Ne pas fixer Content-Type
    return apiRequest("/projects", {
      method: "POST",
      body: formData,
    });
  }
  // Sinon, c'est un payload simple (JSON)
  return apiRequest("/projects", {
    method: "POST",
    body: JSON.stringify(arg),
  });
}

// Ajout d'un membre à un projet
export function addMemberToProject(projectId: string, userId: string, roleInProject: string = "EMPLOYEE") {
  return apiRequest(`/projects/${projectId}/members`, {
    method: "POST",
    body: JSON.stringify({ userId, roleInProject }),
    headers: { "Content-Type": "application/json" },
  });
}
