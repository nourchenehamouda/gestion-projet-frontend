"use client";

import { use, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useProject, useProjects } from "@/hooks/useProjects";
import { useAuth } from "@/hooks/useAuth";
import { useUsers } from "@/hooks/useUsers";
import { downloadProjectDocument } from "@/services/project.service";
import { createTask, updateTask, deleteTask } from "@/services/task.service";
import { generateProjectReport } from "@/services/report.service";
import { projectStatusLabels, taskStatusLabels } from "@/utils/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AddMemberModal from "@/components/AddMemberModal";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import {
  ArrowLeftIcon,
  SparklesIcon,
  FolderIcon,
  CalendarIcon,
  UsersIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  PencilSquareIcon,
  XMarkIcon,
  UserIcon,
  ArrowsRightLeftIcon,
  CheckIcon,
  EllipsisVerticalIcon,
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

const priorityLabels: Record<string, string> = {
  LOW: "Basse",
  MEDIUM: "Moyenne",
  HIGH: "Haute",
};

const priorityColors: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-600",
  MEDIUM: "bg-amber-100 text-amber-700",
  HIGH: "bg-red-100 text-red-700",
};

const tabs = [
  { id: "board", label: "Tableau", icon: ClipboardDocumentListIcon },
  { id: "documents", label: "Documents", icon: DocumentTextIcon },
];

const STATUSES = ["TODO", "IN_PROGRESS", "DONE"] as const;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  const { project, tasks, isLoading, error } = useProject(projectId);
  const { role } = useAuth();
  const queryClient = useQueryClient();
  const { addMember } = useProjects();
  const { data: allUsers = [] } = useUsers();

  const [activeTab, setActiveTab] = useState("board");
  
  // Task modal states
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<string | null>(null); // status for new task
  
  // Add member modal
  const [showAddMember, setShowAddMember] = useState(false);
  
  // Bulk selection
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [bulkMode, setBulkMode] = useState(false);
  
  // Drag & drop
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // Task context menu
  const [contextMenu, setContextMenu] = useState<{ taskId: string; x: number; y: number } | null>(null);

  const canManage = role === "ADMIN" || role === "PROJECT_MANAGER";

  // Mutations
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] });
      setSelectedTasks(new Set());
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: (data: any) => createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-tasks", projectId] });
      setShowCreateModal(null);
    },
  });

  // Group tasks by status for Kanban
  const kanbanColumns = {
    TODO: tasks.filter((t: any) => t.status === "TODO"),
    IN_PROGRESS: tasks.filter((t: any) => t.status === "IN_PROGRESS"),
    DONE: tasks.filter((t: any) => t.status === "DONE"),
  };

  // Drag & Drop handlers
  const handleDragStart = (taskId: string) => {
    if (!canManage) return;
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    if (!draggedTaskId) return;

    const task = tasks.find((t: any) => t.id === draggedTaskId);
    if (task && task.status !== newStatus) {
      updateTaskMutation.mutate({ id: draggedTaskId, data: { status: newStatus } });
    }
    setDraggedTaskId(null);
  };

  // Bulk actions
  const toggleTaskSelection = (taskId: string) => {
    const newSet = new Set(selectedTasks);
    if (newSet.has(taskId)) {
      newSet.delete(taskId);
    } else {
      newSet.add(taskId);
    }
    setSelectedTasks(newSet);
  };

  const selectAllInColumn = (status: string) => {
    const newSet = new Set(selectedTasks);
    const columnTasks = tasks.filter((t: any) => t.status === status);
    const allSelected = columnTasks.every((t: any) => selectedTasks.has(t.id));
    
    if (allSelected) {
      columnTasks.forEach((t: any) => newSet.delete(t.id));
    } else {
      columnTasks.forEach((t: any) => newSet.add(t.id));
    }
    setSelectedTasks(newSet);
  };

  const bulkChangeStatus = async (newStatus: string) => {
    for (const taskId of selectedTasks) {
      await updateTaskMutation.mutateAsync({ id: taskId, data: { status: newStatus } });
    }
    setSelectedTasks(new Set());
    setBulkMode(false);
  };

  const bulkDeleteTasks = async () => {
    if (!window.confirm(`Supprimer ${selectedTasks.size} tâche(s) ?`)) return;
    for (const taskId of selectedTasks) {
      await deleteTaskMutation.mutateAsync(taskId);
    }
    setSelectedTasks(new Set());
    setBulkMode(false);
  };

  const projectData = project as any;

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
            Le projet demandé n&apos;existe pas ou vous n&apos;avez pas les permissions.
          </p>
          <Link href="/projects" className="btn-primary">
            Retour aux projets
          </Link>
        </div>
      </div>
    );
  }

  // Find member name by userId
  const getMemberName = (userId: string) => {
    const member = projectData.members?.find((m: any) => m.userId === userId);
    return member?.userName || "Non assigné";
  };

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

          {/* Bulk Actions Bar */}
          {canManage && bulkMode && selectedTasks.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 font-medium">
                {selectedTasks.size} sélectionnée(s)
              </span>
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => bulkChangeStatus(s)}
                  className="px-3 py-1.5 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  → {taskStatusLabels[s]}
                </button>
              ))}
              <button
                onClick={bulkDeleteTasks}
                className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setSelectedTasks(new Set()); setBulkMode(false); }}
                className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Annuler
              </button>
            </div>
          )}
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
            <div
              className={`h-2 bg-gradient-to-r ${statusGradients[projectData.status] || statusGradients.PLANNED}`}
            />
            <div className="p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-4 rounded-2xl bg-gradient-to-br ${statusGradients[projectData.status] || statusGradients.PLANNED}`}
                    >
                      <FolderIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                        {projectData.name}
                      </h1>
                      <span
                        className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${statusBg[projectData.status] || statusBg.PLANNED}`}
                      >
                        {projectStatusLabels[projectData.status as keyof typeof projectStatusLabels] || projectData.status}
                      </span>
                    </div>
                  </div>
                  {projectData.description && (
                    <p className="mt-4 text-slate-600 max-w-2xl">{projectData.description}</p>
                  )}
                </div>
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
                      <p className="text-sm font-medium text-slate-900">{projectData.members?.length || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl">
                    <ClipboardDocumentListIcon className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Tâches</p>
                      <p className="text-sm font-medium text-slate-900">{tasks.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Tabs + Bulk Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}

            <button
              onClick={() => generateProjectReport({ project: projectData, tasks })}
              disabled={projectData.status !== "DONE"}
              title={projectData.status !== "DONE" ? "Le projet doit être terminé pour générer le rapport" : "Générer le rapport PDF"}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all border ${
                projectData.status === "DONE"
                  ? "bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 shadow-sm"
                  : "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
              }`}
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              Rapport
              {projectData.status !== "DONE" && (
                <span className="ml-1 text-[10px] uppercase tracking-wider font-bold text-slate-400/80">(Bientôt)</span>
              )}
            </button>
          </div>

          {canManage && activeTab === "board" && (
            <button
              onClick={() => { setBulkMode(!bulkMode); setSelectedTasks(new Set()); }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                bulkMode
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <CheckIcon className="w-4 h-4" />
              Sélection multiple
            </button>
          )}
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
              {Object.entries(kanbanColumns).map(([status, columnTasks]) => {
                const colTasks = columnTasks as any[];
                const allSelected = colTasks.length > 0 && colTasks.every((t) => selectedTasks.has(t.id));
                const isDragOver = dragOverColumn === status;

                return (
                  <div
                    key={status}
                    className={`bg-white rounded-3xl border overflow-hidden transition-all ${
                      isDragOver ? "border-indigo-300 ring-2 ring-indigo-100" : "border-slate-100"
                    }`}
                    onDragOver={(e) => handleDragOver(e, status)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, status)}
                  >
                    {/* Column Header */}
                    <div className={`p-4 border-b border-slate-100 bg-gradient-to-r ${taskStatusGradients[status]}`}>
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                          {status === "TODO" && <ClockIcon className="w-5 h-5" />}
                          {status === "IN_PROGRESS" && <ClipboardDocumentListIcon className="w-5 h-5" />}
                          {status === "DONE" && <CheckCircleIcon className="w-5 h-5" />}
                          {taskStatusLabels[status as keyof typeof taskStatusLabels] || status}
                        </h3>
                        <div className="flex items-center gap-2">
                          {bulkMode && colTasks.length > 0 && (
                            <button
                              onClick={() => selectAllInColumn(status)}
                              className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
                                allSelected
                                  ? "bg-white text-indigo-600"
                                  : "bg-white/20 text-white hover:bg-white/30"
                              }`}
                            >
                              {allSelected ? "✓ Tous" : "Tout"}
                            </button>
                          )}
                          <span className="px-2 py-0.5 bg-white/20 rounded-full text-sm text-white">
                            {colTasks.length}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tasks */}
                    <div className="p-4 space-y-3 min-h-[200px]">
                      {colTasks.length === 0 ? (
                        <div className="text-center py-8">
                          <ClipboardDocumentListIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                          <p className="text-sm text-slate-400">Aucune tâche</p>
                        </div>
                      ) : (
                        colTasks.map((task: any, index: number) => {
                          const isSelected = selectedTasks.has(task.id);
                          const isDragged = draggedTaskId === task.id;

                          return (
                            <motion.div
                              key={task.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.03 }}
                              draggable={canManage && !bulkMode}
                              onDragStart={() => handleDragStart(task.id)}
                              onDragEnd={() => setDraggedTaskId(null)}
                              className={`p-4 rounded-xl transition-all group relative ${
                                isDragged
                                  ? "opacity-50 rotate-2 scale-95"
                                  : isSelected
                                  ? "bg-indigo-50 border-2 border-indigo-300 shadow-md"
                                  : "bg-slate-50 hover:shadow-md border-2 border-transparent"
                              } ${canManage && !bulkMode ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}`}
                              onClick={() => {
                                if (bulkMode) {
                                  toggleTaskSelection(task.id);
                                }
                              }}
                            >
                              {/* Bulk checkbox */}
                              {bulkMode && (
                                <div className="absolute -top-2 -left-2 z-10">
                                  <div
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                      isSelected
                                        ? "bg-indigo-600 border-indigo-600"
                                        : "bg-white border-slate-300"
                                    }`}
                                  >
                                    {isSelected && <CheckIcon className="w-4 h-4 text-white" />}
                                  </div>
                                </div>
                              )}

                              {/* Task Actions (on hover) */}
                              {canManage && !bulkMode && (
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setEditingTask(task); }}
                                    className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors"
                                    title="Modifier"
                                  >
                                    <PencilSquareIcon className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (window.confirm(`Supprimer "${task.title}" ?`)) {
                                        deleteTaskMutation.mutate(task.id);
                                      }
                                    }}
                                    className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                                    title="Supprimer"
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </button>
                                </div>
                              )}

                              <h4 className="font-medium text-slate-900 pr-16 group-hover:text-indigo-600 transition-colors">
                                {task.title || task.name}
                              </h4>

                              {task.description && (
                                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{task.description}</p>
                              )}

                              <div className="flex items-center gap-2 mt-3 flex-wrap">
                                {/* Priority badge */}
                                {task.priority && (
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${priorityColors[task.priority] || "bg-slate-100 text-slate-600"}`}>
                                    {priorityLabels[task.priority] || task.priority}
                                  </span>
                                )}

                                {/* Assignee */}
                                {task.assigneeId && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 text-purple-700">
                                    <UserIcon className="w-3 h-3" />
                                    {getMemberName(task.assigneeId)}
                                  </span>
                                )}

                                {/* Due date */}
                                {task.dueDate && (
                                  <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                                    <CalendarIcon className="w-3 h-3" />
                                    {new Date(task.dueDate).toLocaleDateString("fr-FR")}
                                  </span>
                                )}
                              </div>
                            </motion.div>
                          );
                        })
                      )}

                      {/* Add Task Button */}
                      {canManage && (
                        <button
                          onClick={() => setShowCreateModal(status)}
                          className="w-full p-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2"
                        >
                          <PlusIcon className="w-5 h-5" />
                          <span className="text-sm font-medium">Ajouter</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
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
              {projectData.hasDocument ? (
                <div className="flex flex-col items-center py-8">
                  <div className="p-4 rounded-2xl bg-indigo-50 mb-4">
                    <DocumentTextIcon className="w-12 h-12 text-indigo-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Document du projet</h3>
                  <p className="text-slate-500 mb-2 text-center">{projectData.documentName || "Document attaché"}</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => downloadProjectDocument(resolvedParams.id, projectData.documentName)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all mt-4"
                  >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    Télécharger
                  </motion.button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <DocumentTextIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Documents du projet</h3>
                  <p className="text-slate-500">Aucun document n&apos;a été ajouté à ce projet.</p>
                </div>
              )}
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <UsersIcon className="w-5 h-5" />
              Membres du projet
            </h2>
            {canManage && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddMember(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium text-sm rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
              >
                <UserPlusIcon className="w-4 h-4" />
                Ajouter un membre
              </motion.button>
            )}
          </div>

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
                    <p className="font-medium text-slate-900 truncate">{member.userName || "Membre"}</p>
                    <p className="text-xs text-slate-500 truncate">{member.roleInProject || "Membre"}</p>
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

      {/* ==================== TASK EDIT/CREATE MODAL ==================== */}
      <AnimatePresence>
        {(editingTask || showCreateModal) && (
          <TaskModal
            task={editingTask}
            defaultStatus={showCreateModal || "TODO"}
            projectId={projectId}
            members={projectData.members || []}
            onClose={() => { setEditingTask(null); setShowCreateModal(null); }}
            onSave={(data) => {
              if (editingTask) {
                updateTaskMutation.mutate(
                  { id: editingTask.id, data },
                  { onSuccess: () => setEditingTask(null) }
                );
              } else {
                createTaskMutation.mutate(
                  { ...data, projectId },
                  { onSuccess: () => setShowCreateModal(null) }
                );
              }
            }}
            isLoading={updateTaskMutation.isPending || createTaskMutation.isPending}
          />
        )}
      </AnimatePresence>

      {/* ==================== ADD MEMBER MODAL ==================== */}
      <AnimatePresence>
        {showAddMember && (
          <AddMemberModal
            projectId={projectId}
            users={allUsers}
            onClose={() => setShowAddMember(false)}
            onAdd={(userId, roleInProject, tasks) => {
              addMember.mutate(
                {
                  projectId,
                  userIds: [userId],
                  roleInProject,
                  tasks,
                },
                {
                  onSuccess: () => setShowAddMember(false),
                }
              );
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* =====================================================================
   TASK MODAL COMPONENT (Create / Edit)
   ===================================================================== */
function TaskModal({
  task,
  defaultStatus,
  projectId,
  members,
  onClose,
  onSave,
  isLoading,
}: {
  task: any | null;
  defaultStatus: string;
  projectId: string;
  members: any[];
  onClose: () => void;
  onSave: (data: any) => void;
  isLoading: boolean;
}) {
  const isEdit = !!task;
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState(task?.status || defaultStatus);
  const [priority, setPriority] = useState(task?.priority || "MEDIUM");
  const [assigneeId, setAssigneeId] = useState(task?.assigneeId || "");
  const [dueDate, setDueDate] = useState(task?.dueDate?.split("T")[0] || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
      assigneeId: assigneeId || undefined,
      dueDate: dueDate || undefined,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isEdit ? "Modifier la tâche" : "Nouvelle tâche"}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {isEdit ? "Modifiez les détails de la tâche." : "Créez une nouvelle tâche pour ce projet."}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <XMarkIcon className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Titre *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Développer la page de login"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description détaillée..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all resize-none"
            />
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Statut</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Priorité</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all"
              >
                <option value="LOW">Basse</option>
                <option value="MEDIUM">Moyenne</option>
                <option value="HIGH">Haute</option>
              </select>
            </div>
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              <span className="inline-flex items-center gap-1">
                <UserIcon className="w-4 h-4" />
                Assigner à
              </span>
            </label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all"
            >
              <option value="">— Non assigné —</option>
              {members.filter((m: any) => m.roleInProject === "EMPLOYEE").map((m: any) => (
                <option key={m.userId} value={m.userId}>
                  {m.userName || m.userId}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date d&apos;échéance</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
            >
              Annuler
            </button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading || !title.trim()}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  {isEdit ? <PencilSquareIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5" />}
                  <span>{isEdit ? "Enregistrer" : "Créer"}</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
