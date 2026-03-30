"use client";

import { useProjects } from "@/hooks/useProjects";
import { useUsers } from "@/hooks/useUsers";
import { 
  ChartBarIcon, 
  FolderIcon, 
  UsersIcon, 
  CheckCircleIcon,
  ClockIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { motion } from "framer-motion";

export default function StatisticsPage() {
  const { projects: rawProjects, isLoading: loadingProjects } = useProjects() as any;
  const { data: rawUsers, isLoading: loadingUsers } = useUsers() as any;

  const projects = (rawProjects || []) as any[];
  const users = (rawUsers || []) as any[];

  const isLoading = loadingProjects || loadingUsers;

  // Calcul des statistiques
  const stats = {
    totalProjects: projects.length,
    totalUsers: users.length,
    completedProjects: projects.filter((p: any) => p.status === "DONE").length,
    activeProjects: projects.filter((p: any) => p.status === "IN_PROGRESS").length,
    totalTasks: projects.reduce((acc: number, p: any) => acc + (p.tasks?.length || 0), 0),
  };

  const statusCount = {
    PLANNED: projects.filter((p: any) => p.status === "PLANNED").length,
    IN_PROGRESS: projects.filter((p: any) => p.status === "IN_PROGRESS").length,
    DONE: projects.filter((p: any) => p.status === "DONE").length,
    PAUSED: projects.filter((p: any) => p.status === "PAUSED").length,
  };

  const getPercentage = (count: number) => {
    if (stats.totalProjects === 0) return 0;
    return Math.round((count / stats.totalProjects) * 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard"
              className="p-2 bg-white rounded-xl shadow-sm hover:bg-slate-50 transition-all text-slate-600"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Statistiques Globales</h1>
              <p className="text-slate-500">Vue d&apos;ensemble de l&apos;activité de la plateforme</p>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            title="Total Projets" 
            value={stats.totalProjects} 
            icon={FolderIcon} 
            color="bg-blue-500" 
          />
          <StatCard 
            title="Utilisateurs" 
            value={stats.totalUsers} 
            icon={UsersIcon} 
            color="bg-emerald-500" 
          />
          <StatCard 
            title="Projets Actifs" 
            value={stats.activeProjects} 
            icon={ClockIcon} 
            color="bg-amber-500" 
          />
          <StatCard 
            title="Projets Terminés" 
            value={stats.completedProjects} 
            icon={CheckCircleIcon} 
            color="bg-indigo-500" 
          />
        </div>

        {/* Status Breakdown Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/60">
            <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5 text-indigo-600" />
              Répartition par Statut
            </h3>
            
            <div className="space-y-6">
              <StatusProgressBar 
                label="En attente (Planned)" 
                count={statusCount.PLANNED} 
                percentage={getPercentage(statusCount.PLANNED)} 
                color="bg-slate-400" 
              />
              <StatusProgressBar 
                label="En cours (In Progress)" 
                count={statusCount.IN_PROGRESS} 
                percentage={getPercentage(statusCount.IN_PROGRESS)} 
                color="bg-amber-400" 
              />
              <StatusProgressBar 
                label="Terminé (Done)" 
                count={statusCount.DONE} 
                percentage={getPercentage(statusCount.DONE)} 
                color="bg-emerald-400" 
              />
              <StatusProgressBar 
                label="En pause (Paused)" 
                count={statusCount.PAUSED} 
                percentage={getPercentage(statusCount.PAUSED)} 
                color="bg-red-400" 
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                <ChartBarIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold">Résumé de Performance</h3>
            </div>
            <p className="text-indigo-100 mb-8 leading-relaxed">
              Le système gère actuellement <strong>{stats.totalProjects} projets</strong> avec un taux de complétion de <strong>{getPercentage(stats.completedProjects)}%</strong>. 
              {stats.activeProjects > 0 ? ` ${stats.activeProjects} projets sont activement suivis.` : " Aucun projet n'est actuellement en cours."}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                <p className="text-indigo-200 text-xs uppercase font-bold tracking-wider mb-1">Membres affectés</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                <p className="text-indigo-200 text-xs uppercase font-bold tracking-wider mb-1">Efficacité</p>
                <p className="text-2xl font-bold">{getPercentage(stats.completedProjects)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 flex items-center gap-5"
    >
      <div className={`p-4 ${color} bg-opacity-10 rounded-2xl text-white`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </motion.div>
  );
}

function StatusProgressBar({ label, count, percentage, color }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-slate-600 font-medium">{label}</span>
        <span className="text-slate-400">{count} ({percentage}%)</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}
