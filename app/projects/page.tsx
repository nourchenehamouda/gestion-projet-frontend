"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/components/Modal";
import ProjectCard from "@/components/ProjectCard";
import { useAuth } from "@/hooks/useAuth";
import { useProjects, useProjectActions } from "@/hooks/useProjects";
import { projectStatusLabels } from "@/utils/constants";
import type { ProjectStatus } from "@/utils/types";

const projectSchema = z.object({
  name: z.string().min(3, "Nom requis"),
  description: z.string().min(10, "Description requise"),
  status: z.enum(["PLANNED", "IN_PROGRESS", "DONE", "PAUSED"]),
  startDate: z.string().min(1, "Date de début requise"),
  endDate: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function ProjectsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, role } = useAuth();
  const { data: projects = [] } = useProjects();
  const { createMutation, deleteMutation } = useProjectActions();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const canManageProjects = role === "PROJECT_MANAGER" || role === "ADMIN";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      status: "PLANNED",
    },
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => a.name.localeCompare(b.name));
  }, [projects]);

  return (
    <div className="space-y-8">
      <header className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Projets
            </p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900">
              Catalogue des projets
            </h1>
            <p className="mt-4 text-slate-600">
              Consultez les projets actifs et suivez l'avancement par statut.
            </p>
          </div>
          {canManageProjects && (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Créer un projet
            </button>
          )}
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        {sortedProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            readOnly={!canManageProjects}
            onEdit={() => router.push(`/projects/${project.id}`)}
            onDelete={() => deleteMutation.mutate(project.id)}
          />
        ))}
      </section>

      <Modal
        isOpen={isModalOpen}
        title="Nouveau projet"
        onClose={() => {
          setIsModalOpen(false);
          reset();
        }}
      >
        <form
          className="space-y-4"
          onSubmit={handleSubmit((data) => {
            createMutation.mutate({
              ...data,
              endDate: data.endDate || null,
            });
            setIsModalOpen(false);
            reset();
          })}
        >
          <label className="block text-sm font-medium text-slate-700">
            Nom du projet
            <input
              type="text"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              {...register("name")}
            />
            {errors.name && (
              <span className="mt-2 block text-xs text-red-600">{errors.name.message}</span>
            )}
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Description
            <textarea
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              rows={3}
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
                {Object.entries(projectStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Date de début
              <input
                type="date"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                {...register("startDate")}
              />
            </label>
          </div>
          <label className="block text-sm font-medium text-slate-700">
            Date de fin (optionnel)
            <input
              type="date"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              {...register("endDate")}
            />
          </label>
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
