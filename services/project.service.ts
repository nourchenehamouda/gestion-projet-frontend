import { apiRequest, getToken } from "@/services/api";
import { API_BASE_URL } from "@/utils/constants";
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

export function getActiveEmployeeIds() {
  return apiRequest("/projects/active-employees");
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

// Assigner une tâche à un membre via l'endpoint dédié
export function assignTaskToMember(projectId: string, taskId: string, assigneeId: string) {
  return apiRequest(`/projects/${projectId}/assign-task`, {
    method: "POST",
    body: JSON.stringify({ taskId, assigneeId }),
    headers: { "Content-Type": "application/json" },
  });
}

// Télécharger le document d'un projet
export async function downloadProjectDocument(projectId: string, fileName?: string) {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/download`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    throw new Error("Impossible de télécharger le document");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName || "document";
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
