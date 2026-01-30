export type Role = "ADMIN" | "PROJECT_MANAGER" | "EMPLOYEE" | "CLIENT";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
};

export type ProjectStatus = "PLANNED" | "IN_PROGRESS" | "DONE" | "PAUSED";

export type ProjectMember = {
  userId: string;
  roleInProject: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate?: string | null;
  endDate?: string | null;
  members: ProjectMember[];
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
  documentAvailable?: boolean;
  documentName?: string;
};
