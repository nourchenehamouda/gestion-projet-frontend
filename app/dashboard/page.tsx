"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useProjects } from "@/hooks/useProjects";
import { mockTasks, projectStatusLabels, taskStatusLabels } from "@/utils/constants";
import type { TaskStatus } from "@/utils/types";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { data: projects = [] } = useProjects();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const projectStats = useMemo(() => {
    return projects.reduce(
      (acc, project) => {
        acc[project.status] += 1;
        return acc;
      },
      { PLANNED: 0, IN_PROGRESS: 0, DONE: 0, PAUSED: 0 },
    );
  }, [projects]);

  const taskStats = useMemo(() => {
    return mockTasks.reduce(
      (acc, task) => {
        acc[task.status] += 1;
        return acc;
      },
      { TODO: 0, IN_PROGRESS: 0, DONE: 0 } as Record<TaskStatus, number>,
    );
  }, []);

  const overdueTasks = mockTasks.filter((task) => task.dueDate && task.status !== "DONE")
    .length;

  return (
    <div className="space-y-8">
      <header className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Tableau de bord
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">
          Vue synthétique des projets et tâches
        </h1>
        <p className="mt-4 text-slate-600">
          Consultez l'état d'avancement global et identifiez rapidement les priorités.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Nombre total de projets</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{projects.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Projets en cours</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {projectStats.IN_PROGRESS}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Tâches en retard</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{overdueTasks}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Tâches en cours</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {taskStats.IN_PROGRESS}
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Projets par statut</h2>
          <div className="mt-6 space-y-3">
            {Object.entries(projectStatusLabels).map(([status, label]) => (
              <div
                key={status}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <span className="text-sm font-medium text-slate-700">{label}</span>
                <span className="text-sm text-slate-500">
                  {projectStats[status as keyof typeof projectStats]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Tâches par statut</h2>
          <div className="mt-6 space-y-3">
            {Object.entries(taskStatusLabels).map(([status, label]) => (
              <div
                key={status}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <span className="text-sm font-medium text-slate-700">{label}</span>
                <span className="text-sm text-slate-500">
                  {taskStats[status as keyof typeof taskStats]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
