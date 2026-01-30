"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { useProjects } from "@/hooks/useProjects";
import { useUsers } from "@/hooks/useUsers";
import { projectStatusLabels } from "@/utils/constants";
import AddMemberModal from "@/components/AddMemberModal";
import {
    FolderIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    TrashIcon,
    UserPlusIcon,
    ArrowLeftIcon,
    SparklesIcon,
    CalendarIcon,
    UsersIcon,
    DocumentTextIcon,
    EyeIcon,
    FunnelIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";

const projectSchema = z.object({
    name: z.string().min(2, "Nom requis"),
    description: z.string().optional(),
    status: z.enum(["PLANNED", "IN_PROGRESS", "DONE", "PAUSED"]),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

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

export default function ProjectsPage() {
    const router = useRouter();
    const { role, isAuthenticated, isLoading, user } = useAuth();
    const { projects = [], create, remove, addMember, isLoading: projectsLoading } = useProjects();
    const { data: users = [] } = useUsers();

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [memberModalProjectId, setMemberModalProjectId] = useState<string | null>(null);
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    const canManage = role === "ADMIN" || role === "PROJECT_MANAGER";

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        defaultValues: { status: "PLANNED" },
    });

    useEffect(() => {
        if (!isLoading && !isAuthenticated) router.replace("/login");
    }, [isAuthenticated, isLoading, router]);

    const filteredProjects = useMemo(() => {
        let result = Array.isArray(projects) ? projects : [];

        // Filter by status
        if (statusFilter !== "ALL") {
            result = result.filter((p: any) => p.status === statusFilter);
        }

        // Filter by search
        if (search.trim()) {
            const term = search.toLowerCase();
            result = result.filter(
                (p: any) =>
                    p.name.toLowerCase().includes(term) ||
                    (p.description && p.description.toLowerCase().includes(term))
            );
        }

        return result;
    }, [search, statusFilter, projects]);

    const statusCounts = useMemo(() => {
        const counts: Record<string, number> = {
            ALL: Array.isArray(projects) ? projects.length : 0,
            PLANNED: 0,
            IN_PROGRESS: 0,
            DONE: 0,
            PAUSED: 0,
        };
        if (Array.isArray(projects)) {
            projects.forEach((p: any) => {
                if (counts[p.status] !== undefined) {
                    counts[p.status]++;
                }
            });
        }
        return counts;
    }, [projects]);

    const onSubmit = async (data: ProjectFormValues) => {
        setFormError(null);

        const payload = { ...data, ownerId: user?.id };
        const mutationArg = documentFile
            ? { payload, document: documentFile }
            : payload;

        // @ts-ignore
        create.mutate(mutationArg, {
            onSuccess: () => {
                reset();
                setDocumentFile(null);
                setShowCreateForm(false);
            },
            onError: (err: any) => {
                setFormError(err?.message || "Erreur lors de la création");
            },
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="loading-spinner" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard"
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
                                <span className="text-slate-600">Projets</span>
                            </span>
                        </div>
                    </div>

                    {canManage && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowCreateForm(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
                        >
                            <PlusIcon className="w-5 h-5" />
                            <span className="hidden sm:inline">Nouveau projet</span>
                        </motion.button>
                    )}
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Page Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Projets</h1>
                    <p className="text-slate-600">
                        {canManage
                            ? "Gérez vos projets, assignez des membres et suivez l'avancement."
                            : "Consultez les projets auxquels vous participez."}
                    </p>
                </motion.div>

                {/* Status Filter Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
                >
                    {(["ALL", "PLANNED", "IN_PROGRESS", "DONE", "PAUSED"] as const).map(
                        (status, index) => {
                            const isActive = statusFilter === status;
                            const gradient = status === "ALL" ? "from-slate-600 to-slate-800" : statusGradients[status];

                            return (
                                <motion.button
                                    key={status}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + index * 0.05 }}
                                    onClick={() => setStatusFilter(status)}
                                    className={`relative p-4 rounded-2xl border transition-all ${isActive
                                        ? "bg-white border-indigo-200 shadow-lg"
                                        : "bg-white/50 border-slate-100 hover:bg-white hover:border-slate-200"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`p-2 rounded-xl bg-gradient-to-br ${gradient} ${isActive ? "" : "opacity-60"
                                                }`}
                                        >
                                            <FolderIcon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-2xl font-bold text-slate-900">
                                                {statusCounts[status]}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {status === "ALL"
                                                    ? "Tous"
                                                    : projectStatusLabels[status as keyof typeof projectStatusLabels]}
                                            </p>
                                        </div>
                                    </div>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeStatusFilter"
                                            className="absolute inset-0 rounded-2xl border-2 border-indigo-500 pointer-events-none"
                                        />
                                    )}
                                </motion.button>
                            );
                        }
                    )}
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <div className="relative max-w-md">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="search"
                            placeholder="Rechercher un projet..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all"
                        />
                    </div>
                </motion.div>

                {/* Projects Grid */}
                {projectsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="skeleton h-64 rounded-3xl" />
                        ))}
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl p-12 text-center border border-slate-100"
                    >
                        <FolderIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                            Aucun projet trouvé
                        </h3>
                        <p className="text-slate-500 mb-6">
                            {canManage
                                ? "Créez votre premier projet pour commencer."
                                : "Vous n'êtes pas encore assigné à un projet."}
                        </p>
                        {canManage && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowCreateForm(true)}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl"
                            >
                                <PlusIcon className="w-5 h-5" />
                                Créer un projet
                            </motion.button>
                        )}
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredProjects.map((project: any, index: number) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-xl hover:border-indigo-100 transition-all duration-300"
                                >
                                    {/* Status Header */}
                                    <div
                                        className={`h-2 bg-gradient-to-r ${statusGradients[project.status]}`}
                                    />

                                    <div className="p-6">
                                        {/* Title & Status */}
                                        <div className="flex items-start justify-between gap-4 mb-4">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                                                    {project.name}
                                                </h3>
                                                <span
                                                    className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${statusBg[project.status]
                                                        }`}
                                                >
                                                    {projectStatusLabels[project.status as keyof typeof projectStatusLabels]}
                                                </span>
                                            </div>
                                            <div className="p-2 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
                                                <FolderIcon className="w-5 h-5 text-indigo-600" />
                                            </div>
                                        </div>

                                        {/* Description */}
                                        {project.description && (
                                            <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                                                {project.description}
                                            </p>
                                        )}

                                        {/* Dates */}
                                        {(project.startDate || project.endDate) && (
                                            <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                                                {project.startDate && (
                                                    <div className="flex items-center gap-1">
                                                        <CalendarIcon className="w-4 h-4" />
                                                        <span>
                                                            {new Date(project.startDate).toLocaleDateString("fr-FR")}
                                                        </span>
                                                    </div>
                                                )}
                                                {project.endDate && (
                                                    <span>
                                                        → {new Date(project.endDate).toLocaleDateString("fr-FR")}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Members */}
                                        {project.members && project.members.length > 0 && (
                                            <div className="flex items-center gap-2 mb-4">
                                                <UsersIcon className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm text-slate-500">
                                                    {project.members.length} membre{project.members.length > 1 ? "s" : ""}
                                                </span>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-4 border-t border-slate-100">
                                            <Link
                                                href={`/projects/${project.id}`}
                                                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                                Voir
                                            </Link>

                                            {canManage && (
                                                <>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => setMemberModalProjectId(project.id)}
                                                        className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                                                        title="Ajouter un membre"
                                                    >
                                                        <UserPlusIcon className="w-4 h-4" />
                                                    </motion.button>

                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => {
                                                            if (
                                                                window.confirm(
                                                                    `Supprimer le projet "${project.name}" ?`
                                                                )
                                                            ) {
                                                                remove.mutate(project.id);
                                                            }
                                                        }}
                                                        className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                        title="Supprimer"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </motion.button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </main>

            {/* Create Project Modal */}
            <AnimatePresence>
                {showCreateForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                        onClick={() => setShowCreateForm(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">
                                        Nouveau projet
                                    </h2>
                                    <p className="text-slate-500 text-sm mt-1">
                                        Créez un projet et commencez à collaborer.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowCreateForm(false)}
                                    className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
                                >
                                    <XMarkIcon className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>

                            {formError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-4 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm"
                                >
                                    {formError}
                                </motion.div>
                            )}

                            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Nom du projet *
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all"
                                        placeholder="Mon nouveau projet"
                                        {...register("name")}
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        rows={3}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all resize-none"
                                        placeholder="Description du projet..."
                                        {...register("description")}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Statut
                                    </label>
                                    <select
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all"
                                        {...register("status")}
                                    >
                                        {Object.entries(projectStatusLabels).map(([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Date de début
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all"
                                            {...register("startDate")}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Date de fin
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all"
                                            {...register("endDate")}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Document (optionnel)
                                    </label>
                                    <label className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-indigo-300 transition-colors">
                                        <DocumentTextIcon className="w-5 h-5 text-slate-400" />
                                        <span className="text-sm text-slate-500">
                                            {documentFile ? documentFile.name : "Cliquez pour ajouter un fichier"}
                                        </span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={(e) =>
                                                setDocumentFile(e.target.files?.[0] || null)
                                            }
                                        />
                                    </label>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateForm(false)}
                                        className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={create.isPending}
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50"
                                    >
                                        {create.isPending ? "Création..." : "Créer le projet"}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Member Modal */}
            <AnimatePresence>
                {memberModalProjectId && (
                    <AddMemberModal
                        projectId={memberModalProjectId}
                        users={users}
                        onClose={() => setMemberModalProjectId(null)}
                        onAdd={(userId, roleInProject, taskTitle) => {
                            addMember.mutate(
                                {
                                    projectId: memberModalProjectId,
                                    userIds: [userId],
                                    roleInProject,
                                    taskTitle,
                                },
                                {
                                    onSuccess: () => setMemberModalProjectId(null),
                                }
                            );
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
