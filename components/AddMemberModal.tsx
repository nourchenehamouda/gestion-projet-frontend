"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { User, Role } from "@/utils/types";
import { roleLabels } from "@/utils/roles";
import {
  MagnifyingGlassIcon,
  UserPlusIcon,
  XMarkIcon,
  ShieldCheckIcon,
  BriefcaseIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

interface AddMemberModalProps {
  projectId: string;
  users: User[];
  onClose: () => void;
  onAdd: (userId: string, roleInProject: string, taskTitle: string) => void;
}

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

export default function AddMemberModal({
  projectId,
  users,
  onClose,
  onAdd,
}: AddMemberModalProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [roleInProject, setRoleInProject] = useState("EMPLOYEE");
  const [taskTitle, setTaskTitle] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL");

  // Filter users - include all roles (employees AND clients)
  const filteredUsers = useMemo(() => {
    let result = users.filter(
      (u) => u.role === "EMPLOYEE" || u.role === "CLIENT"
    );

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
  }, [users, roleFilter, search]);

  const handleAdd = () => {
    if (!selectedUser) return;
    onAdd(selectedUser.id, roleInProject, taskTitle);
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
        className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Ajouter un membre</h2>
            <p className="text-slate-500 text-sm mt-1">
              Sélectionnez un employé ou client à ajouter au projet.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Search & Filter */}
        <div className="space-y-3 mb-4">
          {/* Search Input */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="search"
              placeholder="Rechercher par nom ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all"
            />
          </div>

          {/* Role Filter Tabs */}
          <div className="flex gap-2">
            {(["ALL", "EMPLOYEE", "CLIENT"] as const).map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${roleFilter === role
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
              >
                {role === "ALL" ? "Tous" : roleLabels[role]}
              </button>
            ))}
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto space-y-2 mb-6 min-h-0 max-h-60">
          {filteredUsers.length === 0 ? (
            <div className="py-8 text-center">
              <UserGroupIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">Aucun utilisateur trouvé</p>
            </div>
          ) : (
            filteredUsers.map((user) => {
              const RoleIcon = roleIcons[user.role as Role];
              const gradient = roleGradients[user.role as Role];
              const isSelected = selectedUser?.id === user.id;

              return (
                <motion.button
                  key={user.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedUser(user)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all ${isSelected
                    ? "bg-indigo-50 border-indigo-200"
                    : "bg-white border-slate-100 hover:border-slate-200"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-semibold`}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-sm text-slate-500 truncate">{user.email}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === "CLIENT"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-emerald-100 text-emerald-700"
                        }`}
                    >
                      {roleLabels[user.role as Role]}
                    </span>
                  </div>
                </motion.button>
              );
            })
          )}
        </div>

        {/* Selected User Form */}
        <AnimatePresence>
          {selectedUser && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pt-4 border-t border-slate-100"
            >
              <div className="p-3 rounded-xl bg-indigo-50 flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${roleGradients[selectedUser.role as Role]
                    } flex items-center justify-center text-white font-semibold text-sm`}
                >
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 text-sm truncate">
                    {selectedUser.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{selectedUser.email}</p>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-1 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4 text-indigo-600" />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Rôle dans le projet
                </label>
                <select
                  value={roleInProject}
                  onChange={(e) => setRoleInProject(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all"
                >
                  <option value="EMPLOYEE">Membre</option>
                  <option value="PROJECT_MANAGER">Responsable</option>
                  {selectedUser.role === "CLIENT" && (
                    <option value="CLIENT">Client</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tâche initiale (optionnel)
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Ex: Développement frontend"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
          >
            Annuler
          </button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAdd}
            disabled={!selectedUser}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlusIcon className="w-5 h-5" />
            Ajouter
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
