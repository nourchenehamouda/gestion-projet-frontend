import type { Role } from "./types";

export const roleLabels: Record<Role, string> = {
  ADMIN: "Administrateur",
  PROJECT_MANAGER: "Chef de projet",
  TEAM_MEMBER: "Membre d'équipe",
};

export const roleRedirects: Record<Role, string> = {
  ADMIN: "/users",
  PROJECT_MANAGER: "/projects",
  TEAM_MEMBER: "/dashboard",
};

export const adminOnlyRoutes = new Set(["/users"]);
