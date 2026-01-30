"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useUserActions, useUsers } from "@/hooks/useUsers";
import { roleLabels } from "@/utils/roles";
import type { Role } from "@/utils/types";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  UserPlusIcon,
  FunnelIcon,
  UsersIcon,
  ShieldCheckIcon,
  BriefcaseIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  SparklesIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const userSchema = z.object({
  name: z.string().min(3, "Nom requis (min 3 caractères)"),
  email: z.string().email("Email invalide"),
  role: z.enum(["ADMIN", "PROJECT_MANAGER", "EMPLOYEE", "CLIENT"]),
  password: z.string().min(6, "Mot de passe requis (min 6 caractères)"),
});

type UserFormValues = z.infer<typeof userSchema>;

const roleIcons: Record<Role, any> = {
  ADMIN: ShieldCheckIcon,
  PROJECT_MANAGER: BriefcaseIcon,
  EMPLOYEE: UserGroupIcon,
  CLIENT: BuildingOfficeIcon,
};

const roleGradients: Record<Role, string> = {
  ADMIN: "from-rose-500 to-pink-600",
  PROJECT_MANAGER: "from-blue-500 to-indigo-600",
  EMPLOYEE: "from-emerald-500 to-teal-600",
  CLIENT: "from-orange-500 to-amber-600",
};

export default function UsersPage() {
  const router = useRouter();
  const { role, isAuthenticated, isLoading } = useAuth();
  const shouldFetchUsers = role === "ADMIN" || role === "PROJECT_MANAGER";
  const { data: allUsers = [] } = useUsers();
  const users = shouldFetchUsers ? allUsers : [];
  const { createMutation, updateMutation } = useUserActions();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL");
  const [formError, setFormError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { role: "EMPLOYEE" },
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
    if (!isLoading && role && role !== "ADMIN" && role !== "PROJECT_MANAGER")
      router.replace("/dashboard");
  }, [isAuthenticated, isLoading, role, router]);

  const filteredUsers = useMemo(() => {
    let result = users;

    // Filter by role
    if (roleFilter !== "ALL") {
      result = result.filter((u) => u.role === roleFilter);
    }

    // Filter by search
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term)
      );
    }

    return result;
  }, [search, roleFilter, users]);

  // Count users by role
  const userCounts = useMemo(() => {
    const counts: Record<Role | "ALL", number> = {
      ALL: users.length,
      ADMIN: 0,
      PROJECT_MANAGER: 0,
      EMPLOYEE: 0,
      CLIENT: 0,
    };
    users.forEach((u) => {
      if (counts[u.role as Role] !== undefined) {
        counts[u.role as Role]++;
      }
    });
    return counts;
  }, [users]);

  const onSubmit = async (data: UserFormValues) => {
    setFormError(null);

    createMutation.mutate(
      { ...data, isActive: true },
      {
        onSuccess: () => {
          reset({ name: "", email: "", role: "EMPLOYEE", password: "" });
          setShowCreateForm(false);
        },
        onError: (err: any) => {
          if (err?.status === 400 && err?.message) {
            setFormError(err.message);
          } else if (err?.message) {
            setFormError(err.message);
          } else {
            setFormError("Erreur lors de la création de l'utilisateur");
          }
        },
      }
    );
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
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-50">
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
                <span className="text-slate-600">Utilisateurs</span>
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
          >
            <UserPlusIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Nouvel utilisateur</span>
          </motion.button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Gestion des utilisateurs
          </h1>
          <p className="text-slate-600">
            Créez des comptes, attribuez les rôles et gérez les accès.
          </p>
        </motion.div>

        {/* Role Filter Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          {(["ALL", "ADMIN", "PROJECT_MANAGER", "EMPLOYEE", "CLIENT"] as const).map(
            (filterRole, index) => {
              const isActive = roleFilter === filterRole;
              const Icon = filterRole === "ALL" ? UsersIcon : roleIcons[filterRole];
              const gradient = filterRole === "ALL" ? "from-slate-600 to-slate-800" : roleGradients[filterRole];

              return (
                <motion.button
                  key={filterRole}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  onClick={() => setRoleFilter(filterRole)}
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
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-bold text-slate-900">
                        {userCounts[filterRole]}
                      </p>
                      <p className="text-xs text-slate-500">
                        {filterRole === "ALL"
                          ? "Tous"
                          : roleLabels[filterRole]}
                      </p>
                    </div>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeFilter"
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
          className="mb-6"
        >
          <div className="relative max-w-md">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="search"
              placeholder="Rechercher par nom ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all"
            />
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Utilisateur
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Rôle
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                <AnimatePresence mode="popLayout">
                  {filteredUsers.map((userItem, index) => {
                    const RoleIcon = roleIcons[userItem.role as Role];
                    const gradient = roleGradients[userItem.role as Role];

                    return (
                      <motion.tr
                        key={userItem.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-semibold`}
                            >
                              {userItem.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">
                                {userItem.name}
                              </p>
                              <p className="text-sm text-slate-500">
                                {userItem.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <select
                            value={userItem.role}
                            onChange={(e) =>
                              updateMutation.mutate({
                                id: userItem.id,
                                payload: { role: e.target.value as Role },
                              })
                            }
                            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-indigo-300 transition-colors"
                          >
                            {Object.entries(roleLabels).map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${userItem.isActive
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-200 text-slate-600"
                              }`}
                          >
                            {userItem.isActive ? (
                              <CheckCircleIcon className="w-3.5 h-3.5" />
                            ) : (
                              <XCircleIcon className="w-3.5 h-3.5" />
                            )}
                            {userItem.isActive ? "Actif" : "Inactif"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() =>
                              updateMutation.mutate({
                                id: userItem.id,
                                payload: { isActive: !userItem.isActive },
                              })
                            }
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${userItem.isActive
                                ? "bg-red-50 text-red-600 hover:bg-red-100"
                                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                              }`}
                          >
                            {userItem.isActive ? "Désactiver" : "Activer"}
                          </motion.button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="px-6 py-12 text-center">
                <UsersIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">Aucun utilisateur trouvé</p>
              </div>
            )}
          </div>
        </motion.div>
      </main>

      {/* Create User Modal */}
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
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Créer un utilisateur
              </h2>
              <p className="text-slate-500 text-sm mb-6">
                Ajoutez un nouvel utilisateur et attribuez un rôle initial.
              </p>

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
                    Nom complet
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all"
                    placeholder="Jean Dupont"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all"
                    placeholder="jean@cni.tn"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all"
                    placeholder="••••••••"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Rôle
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all"
                    {...register("role")}
                  >
                    {Object.entries(roleLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
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
                    disabled={createMutation.isPending}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50"
                  >
                    {createMutation.isPending ? "Création..." : "Créer"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
