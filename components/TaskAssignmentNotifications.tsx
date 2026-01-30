"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getNotifications, acceptNotification, refuseNotification, getPendingNotifications } from "@/services/notification.service";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import {
  BellIcon,
  CheckIcon,
  XMarkIcon,
  FolderIcon,
  ClipboardDocumentListIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";

export type TaskAssignmentNotificationDto = {
  id: string;
  taskId: string;
  projectId: string;
  employeeId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  taskTitle?: string;
  taskName?: string;
  projectName?: string;
};

export default function TaskAssignmentNotifications() {
  const [notifications, setNotifications] = useState<TaskAssignmentNotificationDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      let data: TaskAssignmentNotificationDto[] = [];
      if (user?.role === "EMPLOYEE") {
        data = (await getPendingNotifications()) as TaskAssignmentNotificationDto[];
      } else {
        data = await getNotifications();
      }
      setNotifications(data);
    } catch (err: any) {
      setError(err?.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const handler = () => fetchNotifications();
    window.addEventListener("refetch-notifications", handler);
    return () => {
      window.removeEventListener("refetch-notifications", handler);
    };
  }, []);

  const handleAction = async (id: string, action: "accept" | "refuse") => {
    setLoading(true);
    setError(null);
    try {
      if (action === "accept") {
        await acceptNotification(id);
      } else {
        await refuseNotification(id);
      }
      await fetchNotifications();
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
    } catch (err: any) {
      setError(err?.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = notifications.filter(n => n.status === "PENDING").length;

  return (
    <div className="space-y-4">
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="loading-spinner" />
        </div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm"
        >
          <p className="font-medium">Erreur</p>
          <p className="mt-1">{error}</p>
        </motion.div>
      )}

      {!loading && !error && notifications.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <InboxIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Aucune notification</p>
          <p className="text-slate-400 text-sm mt-1">
            Vous serez notifié lors de nouvelles assignations
          </p>
        </motion.div>
      )}

      <AnimatePresence mode="popLayout">
        {!loading && !error && notifications.map((notif, index) => {
          const isProjectInvite = notif.projectId && !notif.taskId;
          const taskLabel = notif.taskTitle && notif.taskTitle.trim() !== ""
            ? notif.taskTitle
            : notif.taskName && notif.taskName.trim() !== ""
              ? notif.taskName
              : notif.taskId;
          const projectLabel = notif.projectName && notif.projectName.trim() !== ""
            ? notif.projectName
            : notif.projectId;

          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.05 }}
              className={`relative overflow-hidden rounded-2xl border transition-all ${notif.status === "PENDING"
                ? "bg-white border-indigo-100 shadow-md"
                : "bg-slate-50 border-slate-100"
                }`}
            >
              {/* Status Bar */}
              <div className={`absolute top-0 left-0 w-1 h-full ${notif.status === "ACCEPTED"
                ? "bg-emerald-500"
                : notif.status === "REJECTED"
                  ? "bg-red-500"
                  : "bg-indigo-500"
                }`} />

              <div className="p-5 pl-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-3 rounded-xl flex-shrink-0 ${isProjectInvite
                    ? "bg-purple-100"
                    : "bg-blue-100"
                    }`}>
                    {isProjectInvite ? (
                      <FolderIcon className="w-5 h-5 text-purple-600" />
                    ) : (
                      <ClipboardDocumentListIcon className="w-5 h-5 text-blue-600" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {isProjectInvite
                            ? "Invitation à rejoindre un projet"
                            : notif.status === "PENDING"
                              ? "Nouvelle tâche assignée"
                              : notif.status === "ACCEPTED"
                                ? "Assignation acceptée"
                                : "Assignation refusée"
                          }
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          {isProjectInvite
                            ? `Projet: ${projectLabel}`
                            : `${projectLabel} • ${taskLabel}`
                          }
                        </p>
                      </div>

                      {/* Status Badge */}
                      {notif.status !== "PENDING" && (
                        <span className={`flex-shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${notif.status === "ACCEPTED"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                          }`}>
                          {notif.status === "ACCEPTED" ? (
                            <>
                              <CheckIcon className="w-3 h-3" />
                              Accepté
                            </>
                          ) : (
                            <>
                              <XMarkIcon className="w-3 h-3" />
                              Refusé
                            </>
                          )}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {notif.status === "PENDING" && (
                      <div className="flex gap-3 mt-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-shadow disabled:opacity-50"
                          onClick={() => handleAction(notif.id, "accept")}
                          disabled={loading}
                        >
                          <CheckIcon className="w-4 h-4" />
                          Accepter
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-medium text-sm hover:bg-slate-200 transition-colors disabled:opacity-50"
                          onClick={() => handleAction(notif.id, "refuse")}
                          disabled={loading}
                        >
                          <XMarkIcon className="w-4 h-4" />
                          Refuser
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
