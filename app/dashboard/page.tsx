"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { roleLabels } from "@/utils/roles";
import Link from "next/link";
import TaskAssignmentNotifications from "@/components/TaskAssignmentNotifications";
import NotificationReceivedPM from "@/components/NotificationReceivedPM";
import {
  FolderIcon,
  UsersIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  BellIcon,
  ArrowRightIcon,
  SparklesIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { user, role, logout, isLoading } = useAuth();

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

  const quickActions = [
    {
      title: "Projets",
      description: "Gérer et suivre vos projets",
      href: "/projects",
      icon: FolderIcon,
      gradient: "from-blue-500 to-indigo-600",
    },
    ...(role === "ADMIN" || role === "PROJECT_MANAGER"
      ? [
        {
          title: "Utilisateurs",
          description: "Gérer les comptes et rôles",
          href: "/users",
          icon: UsersIcon,
          gradient: "from-emerald-500 to-teal-600",
        },
      ]
      : []),
    {
      title: "Statistiques",
      description: "Tableaux de bord et rapports",
      href: "#",
      icon: ChartBarIcon,
      gradient: "from-purple-500 to-pink-600",
      disabled: true,
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold font-display">
              <span className="text-gradient">CNI</span>{" "}
              <span className="text-slate-600">Projets</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-semibold text-slate-900 text-sm">{user.name}</p>
              <p className="text-xs text-slate-500">{role ? roleLabels[role] : user.role}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all disabled:opacity-50"
            >
              {logout.isPending ? "..." : "Déconnexion"}
            </motion.button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
            <CalendarDaysIcon className="w-4 h-4" />
            <span>
              {new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            {getGreeting()}, <span className="text-gradient">{user.name.split(" ")[0]}</span> 👋
          </h1>
          <p className="text-slate-600 mt-2">
            Voici un aperçu de votre espace de travail
          </p>
        </motion.section>

        {/* Notifications Section */}
        {role === "EMPLOYEE" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-amber-100">
                <BellIcon className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                Notifications d'assignation
              </h2>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <TaskAssignmentNotifications />
            </div>
          </motion.section>
        )}

        {(role === "PROJECT_MANAGER" || role === "ADMIN") && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-10"
          >
            <NotificationReceivedPM />
          </motion.section>
        )}

        {/* User Info Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white">
            {/* Background Pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '24px 24px'
              }}
            />

            <div className="relative">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <UsersIcon className="w-5 h-5" />
                Informations utilisateur
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-white/60 text-sm">Nom</p>
                  <p className="font-semibold text-lg">{user.name}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Email</p>
                  <p className="font-semibold text-lg truncate">{user.email}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm">Rôle</p>
                  <span className="inline-block mt-1 px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                    {role ? roleLabels[role] : user.role}
                  </span>
                </div>
                <div>
                  <p className="text-white/60 text-sm">ID</p>
                  <p className="font-mono text-xs mt-1 truncate">{user.id}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <ClipboardDocumentListIcon className="w-5 h-5" />
            Accès rapide
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                {action.disabled ? (
                  <div className="group relative bg-white rounded-3xl p-6 border border-slate-100 shadow-sm opacity-60 cursor-not-allowed">
                    <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${action.gradient} mb-4`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900">{action.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{action.description}</p>
                    <span className="inline-block mt-3 text-xs text-slate-400 font-medium">
                      Bientôt disponible
                    </span>
                  </div>
                ) : (
                  <Link
                    href={action.href}
                    className="group relative bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 block"
                  >
                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />

                    <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${action.gradient} mb-4 group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>

                    <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">{action.description}</p>

                    <div className="flex items-center gap-1 mt-4 text-sm font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Accéder</span>
                      <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
}
