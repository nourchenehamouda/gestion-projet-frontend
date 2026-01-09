"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import KanbanBoard from "@/components/KanbanBoard";
import Modal from "@/components/Modal";
import { useAuth } from "@/hooks/useAuth";
import { useProject } from "@/hooks/useProjects";
import { useTaskActions, useTasks } from "@/hooks/useTasks";
import { projectStatusLabels, taskStatusLabels } from "@/utils/constants";
import type { Task, TaskStatus } from "@/utils/types";

const taskSchema = z.object({
  title: z.string().min(3, "Titre requis"),
  description: z.string().min(5, "Description requise"),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  dueDate: z.string().optional(),
  assigneeId: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

const nextStatus: Record<TaskStatus, TaskStatus> = {
  TODO: "IN_PROGRESS",
  IN_PROGRESS: "DONE",
  DONE: "DONE",
};

export default function ProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = String(params.id);
  const { isAuthenticated, isLoading, role, user } = useAuth();
  const { data: project } = useProject(projectId);
  const { data: tasks = [] } = useTasks(projectId);
  const { createMutation, updateMutation } = useTaskActions(projectId);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const canManageTasks = role === "PROJECT_MANAGER" || role === "ADMIN";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const onEditTask = (task: Task) => {
    setSelectedTask(task);
    reset({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ?? "",
      assigneeId: task.assigneeId ?? "",
    });
    setIsTaskModalOpen(true);
  };

  const canUpdateStatus = (task: Task) => {
    if (canManageTasks) {
      return true;
    }
    return task.assigneeId && user?.id === task.assigneeId;
  };

  const projectMembers = useMemo(() => project?.members ?? [], [project]);

  if (!project) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-sm text-slate-500">Chargement du projet...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Projet
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              {project.name}
            </h1>
            <p className="mt-3 text-slate-600">{project.description}</p>
          </div>
          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
            {projectStatusLabels[project.status]}
          </span>
        </div>
        <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="rounded-full border border-slate-200 px-3 py-1">
            Début: {project.startDate}
          </span>
          {project.endDate && (
            <span className="rounded-full border border-slate-200 px-3 py-1">
              Fin: {project.endDate}
            </span>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
          {projectMembers.map((member) => (
            <span key={member.id} className="rounded-full border border-slate-200 px-3 py-1">
              {member.name}
            </span>
          ))}
        </div>
      </header>

      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900">Tableau Kanban</h2>
          {canManageTasks && (
            <button
              type="button"
              onClick={() => {
                setSelectedTask(null);
                reset({
                  title: "",
                  description: "",
                  status: "TODO",
                  priority: "MEDIUM",
                  dueDate: "",
                  assigneeId: "",
                });
                setIsTaskModalOpen(true);
              }}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Créer une tâche
            </button>
          )}
        </div>
        <div className="mt-6">
          <KanbanBoard
            tasks={tasks}
            onEditTask={onEditTask}
            onMoveTask={(task) =>
              updateMutation.mutate({
                id: task.id,
                payload: { status: nextStatus[task.status] },
              })
            }
            canUpdateStatus={canUpdateStatus}
          />
        </div>
      </section>

      <Modal
        isOpen={isTaskModalOpen}
        title={selectedTask ? "Modifier la tâche" : "Nouvelle tâche"}
        onClose={() => setIsTaskModalOpen(false)}
      >
        <form
          className="space-y-4"
          onSubmit={handleSubmit((data) => {
            if (selectedTask) {
              updateMutation.mutate({
                id: selectedTask.id,
                payload: {
                  ...data,
                  dueDate: data.dueDate || null,
                  assigneeId: data.assigneeId || null,
                },
              });
            } else {
              createMutation.mutate({
                ...data,
                projectId,
                dueDate: data.dueDate || null,
                assigneeId: data.assigneeId || null,
              });
            }
            setIsTaskModalOpen(false);
          })}
        >
          <label className="block text-sm font-medium text-slate-700">
            Titre
            <input
              type="text"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              {...register("title")}
            />
            {errors.title && (
              <span className="mt-2 block text-xs text-red-600">{errors.title.message}</span>
            )}
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Description
            <textarea
              rows={3}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              {...register("description")}
            />
            {errors.description && (
              <span className="mt-2 block text-xs text-red-600">
                {errors.description.message}
              </span>
            )}
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Statut
              <select
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                {...register("status")}
              >
                {Object.entries(taskStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Priorité
              <select
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                {...register("priority")}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Échéance
              <input
                type="date"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                {...register("dueDate")}
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Assignation
              <select
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                {...register("assigneeId")}
              >
                <option value="">Non assigné</option>
                {projectMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
          >
            Enregistrer
          </button>
        </form>
      </Modal>
    </div>
  );
}
