"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { roleLabels } from "@/utils/roles";
import { useEffect, useRef, useState } from "react";
import { getNotifications, acceptNotification, refuseNotification } from "@/services/notification.service";
import { useQueryClient } from "@tanstack/react-query";
import {
  BellIcon,
  CheckIcon,
  XMarkIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { BellAlertIcon } from "@heroicons/react/24/solid";

type NotificationDto = {
  id: string;
  taskId: string;
  projectId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  projectName?: string;
  taskTitle?: string;
  taskName?: string;
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifError, setNotifError] = useState<string | null>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const pendingCount = notifications.filter(n => n.status === "PENDING").length;

  const fetchNotifications = async () => {
    setNotifLoading(true);
    setNotifError(null);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err: any) {
      if (err?.status && err?.message) {
        setNotifError(`Erreur ${err.status} : ${err.message}`);
      } else {
        setNotifError(err?.message || "Erreur lors du chargement des notifications");
      }
    } finally {
      setNotifLoading(false);
    }
  };

  useEffect(() => {
    if (notifOpen) fetchNotifications();
  }, [notifOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifOpen]);

  const handleAction = async (id: string, action: "accept" | "refuse") => {
    setNotifLoading(true);
    setNotifError(null);
    try {
      if (action === "accept") await acceptNotification(id);
      else await refuseNotification(id);
      await fetchNotifications();
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    } catch (err: any) {
      setNotifError(err?.message || "Erreur lors de l'action");
    } finally {
      setNotifLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200/50 bg-white/80 backdrop-blur-lg px-6 py-4">
      <Link href="/dashboard" className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <SparklesIcon className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold font-display">
          <span className="text-gradient">CNI</span>{" "}
          <span className="text-slate-600">Projets</span>
        </span>
      </Link>

      <div className="flex items-center gap-4">
        {/* Notifications Button */}
        <div className="relative" ref={notifRef}>
          <motion.button
            type="button"
            aria-label="Notifications"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
            onClick={() => setNotifOpen(v => !v)}
          >
            {pendingCount > 0 ? (
              <BellAlertIcon className="w-5 h-5 text-indigo-600" />
            ) : (
              <BellIcon className="w-5 h-5 text-slate-600" />
            )}
            <AnimatePresence>
              {pendingCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg"
                >
                  {pendingCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden"
              >
                <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                  <h3 className="font-semibold text-slate-900">Notifications</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {pendingCount > 0
                      ? `${pendingCount} notification${pendingCount > 1 ? 's' : ''} en attente`
                      : 'Aucune notification en attente'
                    }
                  </p>
                </div>

                <div className="max-h-80 overflow-y-auto p-3">
                  {notifLoading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="loading-spinner" />
                    </div>
                  )}

                  {notifError && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                      {notifError}
                    </div>
                  )}

                  {!notifLoading && !notifError && notifications.length === 0 && (
                    <div className="py-8 text-center">
                      <BellIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 text-sm">Aucune notification</p>
                    </div>
                  )}

                  {!notifLoading && !notifError && notifications.length > 0 && (
                    <div className="space-y-2">
                      {notifications.map((notif) => {
                        const isProjectInvite = notif.projectId && !notif.taskId;
                        const taskLabel = notif.taskTitle || notif.taskName || notif.taskId;
                        const projectLabel = notif.projectName || notif.projectId;

                        return (
                          <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`p-4 rounded-xl border transition-all ${notif.status === "PENDING"
                                ? "bg-white border-indigo-100 shadow-sm"
                                : "bg-slate-50 border-slate-100"
                              }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${notif.status === "ACCEPTED"
                                  ? "bg-emerald-100"
                                  : notif.status === "REJECTED"
                                    ? "bg-red-100"
                                    : "bg-indigo-100"
                                }`}>
                                {notif.status === "ACCEPTED" ? (
                                  <CheckIcon className="w-4 h-4 text-emerald-600" />
                                ) : notif.status === "REJECTED" ? (
                                  <XMarkIcon className="w-4 h-4 text-red-600" />
                                ) : (
                                  <BellIcon className="w-4 h-4 text-indigo-600" />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-900 text-sm">
                                  {isProjectInvite ? "Invitation projet" : "Assignation tâche"}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5 truncate">
                                  {isProjectInvite
                                    ? `Projet: ${projectLabel}`
                                    : `${projectLabel} • ${taskLabel}`
                                  }
                                </p>

                                {notif.status === "PENDING" && (
                                  <div className="flex gap-2 mt-3">
                                    <motion.button
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      className="flex-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold hover:shadow-md transition-shadow"
                                      onClick={() => handleAction(notif.id, "accept")}
                                      disabled={notifLoading}
                                    >
                                      Accepter
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
                                      onClick={() => handleAction(notif.id, "refuse")}
                                      disabled={notifLoading}
                                    >
                                      Refuser
                                    </motion.button>
                                  </div>
                                )}

                                {notif.status === "ACCEPTED" && (
                                  <span className="inline-block mt-2 text-xs text-emerald-600 font-medium">
                                    ✓ Accepté
                                  </span>
                                )}

                                {notif.status === "REJECTED" && (
                                  <span className="inline-block mt-2 text-xs text-red-600 font-medium">
                                    ✕ Refusé
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Info */}
        {user && (
          <div className="text-right hidden sm:block">
            <p className="font-semibold text-slate-900 text-sm">{user.name}</p>
            <p className="text-xs text-slate-500">{roleLabels[user.role]}</p>
          </div>
        )}

        {/* Logout Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => logout.mutate()}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all"
        >
          Déconnexion
        </motion.button>
      </div>
    </header>
  );
}
