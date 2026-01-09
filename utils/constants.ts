import type { Project, Task, User } from "./types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";

export const projectStatusLabels = {
  PLANNED: "Planifié",
  IN_PROGRESS: "En cours",
  DONE: "Terminé",
  PAUSED: "En pause",
} as const;

export const taskStatusLabels = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
} as const;

export const mockUsers: User[] = [
  {
    id: "USR-001",
    name: "Aïssata Traoré",
    email: "a.traore@cni.local",
    role: "ADMIN",
    isActive: true,
    createdAt: "2024-04-01",
  },
  {
    id: "USR-002",
    name: "Mohamed Diallo",
    email: "m.diallo@cni.local",
    role: "PROJECT_MANAGER",
    isActive: true,
    createdAt: "2024-04-05",
  },
  {
    id: "USR-003",
    name: "Khadija Koné",
    email: "k.kone@cni.local",
    role: "TEAM_MEMBER",
    isActive: true,
    createdAt: "2024-04-10",
  },
];

export const mockProjects: Project[] = [
  {
    id: "PRJ-001",
    name: "CNI-Portal",
    description: "Modernisation du portail de gestion interne.",
    status: "IN_PROGRESS",
    startDate: "2024-05-01",
    endDate: "2024-06-15",
    members: [
      { id: "USR-002", name: "Mohamed Diallo", role: "PROJECT_MANAGER" },
      { id: "USR-003", name: "Khadija Koné", role: "TEAM_MEMBER" },
    ],
  },
  {
    id: "PRJ-002",
    name: "Kanban Core",
    description: "Refonte du workflow de tâches et sprints.",
    status: "PLANNED",
    startDate: "2024-06-01",
    endDate: "2024-07-01",
    members: [{ id: "USR-003", name: "Khadija Koné", role: "TEAM_MEMBER" }],
  },
  {
    id: "PRJ-003",
    name: "Docs Hub",
    description: "Centralisation des documents projet et versions.",
    status: "PAUSED",
    startDate: "2024-03-12",
    endDate: null,
    members: [{ id: "USR-002", name: "Mohamed Diallo", role: "PROJECT_MANAGER" }],
  },
];

export const mockTasks: Task[] = [
  {
    id: "TSK-001",
    projectId: "PRJ-001",
    title: "Configurer l'authentification",
    description: "Mettre en place JWT + RBAC.",
    status: "IN_PROGRESS",
    priority: "HIGH",
    assigneeId: "USR-003",
    dueDate: "2024-05-20",
    createdAt: "2024-05-10",
  },
  {
    id: "TSK-002",
    projectId: "PRJ-001",
    title: "Créer la base Kanban",
    description: "Implémenter les colonnes To Do / In Progress / Done.",
    status: "TODO",
    priority: "MEDIUM",
    assigneeId: "USR-003",
    dueDate: "2024-05-22",
    createdAt: "2024-05-11",
  },
  {
    id: "TSK-003",
    projectId: "PRJ-001",
    title: "Configurer la collection projects",
    description: "Modèle + endpoints CRUD.",
    status: "DONE",
    priority: "LOW",
    assigneeId: "USR-002",
    dueDate: "2024-05-12",
    createdAt: "2024-05-05",
  },
  {
    id: "TSK-004",
    projectId: "PRJ-002",
    title: "Préparer backlog sprint",
    description: "Lister les tâches initiales.",
    status: "TODO",
    priority: "MEDIUM",
    assigneeId: "USR-002",
    dueDate: "2024-06-05",
    createdAt: "2024-05-29",
  },
];
