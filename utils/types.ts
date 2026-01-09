export type Role = "ADMIN" | "PROJECT_MANAGER" | "TEAM_MEMBER";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
};

export type ProjectStatus = "PLANNED" | "IN_PROGRESS" | "DONE" | "PAUSED";

export type Project = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  endDate?: string | null;
  members: Array<{ id: string; name: string; role: Role }>;
};

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type Task = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string | null;
  dueDate?: string | null;
  createdAt: string;
};
