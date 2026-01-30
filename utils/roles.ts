import type { Role } from "./types";

export const roleLabels: Record<Role, string> = {
  ADMIN: "Administrateur",
  PROJECT_MANAGER: "Chef de projet",
  EMPLOYEE: "Employé",
  CLIENT: "Client",
};

export const roleRedirects: Record<Role, string> = {
  ADMIN: "/dashboard",
  PROJECT_MANAGER: "/dashboard",
  EMPLOYEE: "/projects",
  CLIENT: "/client",
};

export const adminOnlyRoutes = new Set(["/users"]);
