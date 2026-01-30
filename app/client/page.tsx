"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useProjects } from "@/hooks/useProjects";
import { projectStatusLabels } from "@/utils/constants";
import {
    FolderIcon,
    DocumentTextIcon,
    ClockIcon,
    CheckCircleIcon,
    ArrowRightIcon,
    EyeIcon,
} from "@heroicons/react/24/outline";

export default function ClientDashboard() {
    const { user, role, logout, isLoading } = useAuth();
    const { projects = [], isLoading: projectsLoading } = useProjects() as any;

    // Filter projects where client is a member
    const clientProjects = Array.isArray(projects)
        ? projects.filter((project: any) =>
            Array.isArray(project.members) &&
            project.members.some((m: any) => m.userId === user?.id)
        )
        : [];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="loading-spinner" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="glass-card p-8 text-center">
                    <p className="text-slate-600 mb-4">Vous n'êtes pas connecté</p>
                    <Link href="/login" className="btn-primary">
                        Se connecter
                    </Link>
                </div>
            </div>
        );
    }

    const stats = [
        {
            label: "Projets assignés",
            value: clientProjects.length,
            icon: FolderIcon,
            gradient: "from-blue-500 to-indigo-600",
        },
        {
            label: "En cours",
            value: clientProjects.filter((p: any) => p.status === "IN_PROGRESS").length,
            icon: ClockIcon,
            gradient: "from-amber-500 to-orange-600",
        },
        {
            label: "Terminés",
            value: clientProjects.filter((p: any) => p.status === "DONE").length,
            icon: CheckCircleIcon,
            gradient: "from-emerald-500 to-teal-600",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold font-display">
                        <span className="text-gradient">CNI</span>{" "}
                        <span className="text-slate-600">Projets</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="font-semibold text-slate-900">{user.name}</p>
                            <p className="text-xs text-slate-500">Client</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => logout.mutate()}
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:border-slate-300 transition-all"
                        >
                            Déconnexion
                        </motion.button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Welcome Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        Bienvenue, {user.name.split(" ")[0]} 👋
                    </h1>
                    <p className="text-slate-600">
                        Consultez l'avancement de vos projets et accédez aux livrables.
                    </p>
                </motion.section>

                {/* Stats Grid */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow"
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`} />
                            <div className="relative">
                                <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} mb-4`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-4xl font-bold text-slate-900">{stat.value}</p>
                                <p className="text-slate-500 mt-1">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.section>

                {/* Projects Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-slate-900">Vos projets</h2>
                    </div>

                    {projectsLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2].map((i) => (
                                <div key={i} className="skeleton h-48 rounded-3xl" />
                            ))}
                        </div>
                    ) : clientProjects.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-3xl p-12 text-center border border-slate-100"
                        >
                            <FolderIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                Aucun projet assigné
                            </h3>
                            <p className="text-slate-500">
                                Vous serez notifié lorsqu'un projet vous sera attribué.
                            </p>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {clientProjects.map((project: any, index: number) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    className="group bg-white rounded-3xl p-6 border border-slate-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                {project.name}
                                            </h3>
                                            <span
                                                className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${project.status === "DONE"
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : project.status === "IN_PROGRESS"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : project.status === "PAUSED"
                                                                ? "bg-amber-100 text-amber-700"
                                                                : "bg-slate-100 text-slate-700"
                                                    }`}
                                            >
                                                {projectStatusLabels[project.status as keyof typeof projectStatusLabels]}
                                            </span>
                                        </div>
                                        <div className="p-3 rounded-2xl bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
                                            <FolderIcon className="w-6 h-6 text-indigo-600" />
                                        </div>
                                    </div>

                                    {project.description && (
                                        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                                            {project.description}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-3">
                                        <Link
                                            href={`/projects/${project.id}`}
                                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
                                        >
                                            <EyeIcon className="w-4 h-4" />
                                            Voir détails
                                        </Link>
                                        {project.documentUrl && (
                                            <a
                                                href={project.documentUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
                                            >
                                                <DocumentTextIcon className="w-4 h-4" />
                                                Documents
                                            </a>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.section>
            </main>
        </div>
    );
}
