import { apiRequest } from "@/services/api";
import type { Task, TaskStatus, TaskPriority } from "@/utils/types";

type CreateTaskPayload = {
  projectId: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  dueDate?: string;
};

type UpdateTaskPayload = Partial<Omit<CreateTaskPayload, "projectId">>;

export async function getTasks() {
  return apiRequest<Task[]>("/tasks");
}

export async function getProjectTasks(projectId: string) {
  return apiRequest<Task[]>(`/projects/${projectId}/tasks`);
}

export async function createTask(payload: CreateTaskPayload) {
  return apiRequest<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateTask(id: string, payload: UpdateTaskPayload) {
  return apiRequest<Task>(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteTask(id: string) {
  return apiRequest<void>(`/tasks/${id}`, {
    method: "DELETE",
  });
}
