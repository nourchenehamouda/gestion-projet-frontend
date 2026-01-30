"use client";

import { use, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useProject } from "@/hooks/useProjects";
import { projectStatusLabels, taskStatusLabels } from "@/utils/constants";
import {
  ArrowLeftIcon,
  SparklesIcon,
  FolderIcon,
  CalendarIcon,
  UsersIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

const statusGradients: Record<string, string> = {
  PLANNED: "from-slate-500 to-slate-700",
  IN_PROGRESS: "from-blue-500 to-indigo-600",
  DONE: "from-emerald-500 to-teal-600",
  PAUSED: "from-amber-500 to-orange-600",
};

const statusBg: Record<string, string> = {
  PLANNED: "bg-slate-100 text-slate-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  DONE: "bg-emerald-100 text-emerald-700",
  PAUSED: "bg-amber-100 text-amber-700",
};

const taskStatusGradients: Record<string, string> = {
  TODO: "from-slate-400 to-slate-600",
  IN_PROGRESS: "from-blue-400 to-indigo-600",
  DONE: "from-emerald-400 to-teal-600",
};

const tabs = [
  { id: "board", label: "Tableau", icon: ClipboardDocumentListIcon },
  { id: "documents", label: "Documents", icon: DocumentTextIcon },
  { id: "reports", label: "Rapports", icon: ChartBarIcon },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { project, tasks, isLoading, error } = useProject(resolvedParams.id);
  const [activeTab, setActiveTab] = useState("board");

  // Group tasks by status for Kanban
  const kanbanColumns = {
    TODO: tasks.filter((t: any) => t.status === "TODO"),
    IN_PROGRESS: tasks.filter((t: any) => t.status === "IN_PROGRESS"),
    DONE: tasks.filter((t: any) => t.status === "DONE"),
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md">
          <ExclamationCircleIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Projet non trouvé
          </h2>
          <p className="text-slate-500 mb-6">
            Le projet demandé n'existe pas ou vous n'avez pas les permissions.
          </p>
          <Link href="/projects" className="btn-primary">
            Retour aux projets
          </Link>
        </div>
      </div>
    );
  }

  const projectData = project as any;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/projects"
              className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-slate-600" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold font-display">
                <span className="text-gradient">CNI</span>{" "}
                <span className="text-slate-600">Projet</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Project Header Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-100 shadow-sm">
            {/* Status Bar */}
            <div
              className={`h-2 bg-gradient-to-r ${statusGradients[projectData.status] || statusGradients.PLANNED
                }`}
            />

            <div className="p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-4 rounded-2xl bg-gradient-to-br ${statusGradients[projectData.status] || statusGradients.PLANNED
                        }`}
                    >
                      <FolderIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                        {projectData.name}
                      </h1>
                      <span
                        className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${statusBg[projectData.status] || statusBg.PLANNED
                          }`}
                      >
                        {projectStatusLabels[projectData.status as keyof typeof projectStatusLabels] ||
                          projectData.status}
                      </span>
                    </div>
                  </div>

                  {projectData.description && (
                    <p className="mt-4 text-slate-600 max-w-2xl">
                      {projectData.description}
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-4">
                  {projectData.startDate && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl">
                      <CalendarIcon className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500">Début</p>
                        <p className="text-sm font-medium text-slate-900">
                          {new Date(projectData.startDate).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                  )}
                  {projectData.endDate && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl">
                      <CalendarIcon className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500">Fin</p>
                        <p className="text-sm font-medium text-slate-900">
                          {new Date(projectData.endDate).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl">
                    <UsersIcon className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Membres</p>
                      <p className="text-sm font-medium text-slate-900">
                        {projectData.members?.length || 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl">
                    <ClipboardDocumentListIcon className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Tâches</p>
                      <p className="text-sm font-medium text-slate-900">
                        {tasks.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-8"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === tab.id
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "board" && (
            <motion.div
              key="board"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {Object.entries(kanbanColumns).map(([status, columnTasks]) => (
                <div key={status} className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
                  {/* Column Header */}
                  <div
                    className={`p-4 border-b border-slate-100 bg-gradient-to-r ${taskStatusGradients[status]}`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white flex items-center gap-2">
                        {status === "TODO" && <ClockIcon className="w-5 h-5" />}
                        {status === "IN_PROGRESS" && (
                          <ClipboardDocumentListIcon className="w-5 h-5" />
                        )}
                        {status === "DONE" && <CheckCircleIcon className="w-5 h-5" />}
                        {taskStatusLabels[status as keyof typeof taskStatusLabels] || status}
                      </h3>
                      <span className="px-2 py-0.5 bg-white/20 rounded-full text-sm text-white">
                        {(columnTasks as any[]).length}
                      </span>
                    </div>
                  </div>

                  {/* Tasks */}
                  <div className="p-4 space-y-3 min-h-[200px]">
                    {(columnTasks as any[]).length === 0 ? (
                      <div className="text-center py-8">
                        <ClipboardDocumentListIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-400">Aucune tâche</p>
                      </div>
                    ) : (
                      (columnTasks as any[]).map((task: any, index: number) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-4 bg-slate-50 rounded-xl hover:shadow-md transition-shadow cursor-pointer group"
                        >
                          <h4 className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {task.title || task.name}
                          </h4>
                          {task.description && (
                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                          {task.dueDate && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                              <CalendarIcon className="w-3 h-3" />
                              {new Date(task.dueDate).toLocaleDateString("fr-FR")}
                            </div>
                          )}
                        </motion.div>
                      ))
                    )}

                    {/* Add Task Button */}
                    <button className="w-full p-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2">
                      <PlusIcon className="w-5 h-5" />
                      <span className="text-sm font-medium">Ajouter</span>
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "documents" && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl border border-slate-100 p-8"
            >
              <div className="text-center py-12">
                <DocumentTextIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Documents du projet
                </h3>
                <p className="text-slate-500 mb-6">
                  {projectData.documentUrl
                    ? "Téléchargez les documents associés au projet."
                    : "Aucun document n'a été ajouté à ce projet."}
                </p>
                {projectData.documentUrl && (
                  <a
                    href={projectData.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <DocumentTextIcon className="w-5 h-5" />
                    Télécharger
                  </a>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "reports" && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl border border-slate-100 p-8"
            >
              <div className="text-center py-12">
                <ChartBarIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Rapports et statistiques
                </h3>
                <p className="text-slate-500">
                  Les rapports détaillés seront bientôt disponibles.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Members Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <UsersIcon className="w-5 h-5" />
            Membres du projet
          </h2>

          {projectData.members && projectData.members.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectData.members.map((member: any, index: number) => (
                <motion.div
                  key={member.userId || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {member.userName?.charAt(0).toUpperCase() || "M"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">
                      {member.userName || "Membre"}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {member.roleInProject || "Membre"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 p-8 text-center">
              <UsersIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">Aucun membre assigné</p>
            </div>
          )}
        </motion.section>
      </main>
    </div>
  );
}
