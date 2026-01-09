import { apiRequest } from "@/services/api";
import type { Task } from "@/utils/types";

type TaskPayload = Omit<Task, "id" | "createdAt">;

export async function getTasks(projectId: string) {
  return apiRequest<Task[]>(`/projects/${projectId}/tasks`);
}

export async function createTask(payload: TaskPayload) {
  return apiRequest<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateTask(id: string, payload: Partial<TaskPayload>) {
  return apiRequest<Task>(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
