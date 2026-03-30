export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8084/api";

export const projectStatusLabels = {
  PLANNED: "Planifié",
  IN_PROGRESS: "En cours",
  DONE: "Terminé",
  PAUSED: "En pause",
} as const;

export const taskStatusLabels = {
  TODO: "À faire",
  IN_PROGRESS: "En cours",
  DONE: "Terminé",
} as const;
