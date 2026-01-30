"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getReceivedNotifications } from "@/services/notification.service";
import {
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  FolderIcon,
  ClipboardDocumentListIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";

export type ReceivedNotificationDto = {
  id: string;
  taskId: string;
  projectId: string;
  senderId: string;
  receiverId: string;
  status: "ACCEPTED" | "REJECTED";
  createdAt: string;
  projectName?: string;
  taskTitle?: string;
  taskName?: string;
  employeeName?: string;
};

export default function NotificationReceivedPM() {
  const [notifications, setNotifications] = useState<ReceivedNotificationDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReceivedNotifications();
      setNotifications(data as ReceivedNotificationDto[]);
    } catch (err: any) {
      setError(err?.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-indigo-100">
          <BellIcon className="w-5 h-5 text-indigo-600" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900">
          Réponses aux assignations
        </h2>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
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
            <p className="text-slate-500 font-medium">Aucune notification reçue</p>
            <p className="text-slate-400 text-sm mt-1">
              Les réponses des employés apparaîtront ici
            </p>
          </motion.div>
        )}

        <AnimatePresence mode="popLayout">
          {!loading && !error && notifications.length > 0 && (
            <div className="space-y-3">
              {notifications.map((notif, index) => {
                const taskLabel =
                  notif.taskTitle && notif.taskTitle.trim() !== ""
                    ? notif.taskTitle
                    : notif.taskName && notif.taskName.trim() !== ""
                      ? notif.taskName
                      : notif.taskId;
                const projectLabel =
                  notif.projectName && notif.projectName.trim() !== ""
                    ? notif.projectName
                    : notif.projectId;

                const isAccepted = notif.status === "ACCEPTED";

                return (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`relative overflow-hidden rounded-2xl border ${isAccepted
                      ? "bg-emerald-50/50 border-emerald-100"
                      : "bg-red-50/50 border-red-100"
                      }`}
                  >
                    {/* Status Bar */}
                    <div
                      className={`absolute top-0 left-0 w-1 h-full ${isAccepted ? "bg-emerald-500" : "bg-red-500"
                        }`}
                    />

                    <div className="p-5 pl-6">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div
                          className={`p-3 rounded-xl flex-shrink-0 ${isAccepted ? "bg-emerald-100" : "bg-red-100"
                            }`}
                        >
                          {isAccepted ? (
                            <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <XCircleIcon className="w-5 h-5 text-red-600" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-slate-900">
                                {isAccepted ? "Assignation acceptée" : "Assignation refusée"}
                              </h3>
                              <p className="text-sm font-medium text-slate-700 mt-0.5">
                                Par: {notif.employeeName || "Employé"}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                                <FolderIcon className="w-4 h-4" />
                                <span>{projectLabel}</span>
                                <span className="text-slate-300">•</span>
                                <ClipboardDocumentListIcon className="w-4 h-4" />
                                <span>{taskLabel}</span>
                              </div>
                            </div>

                            {/* Status Badge */}
                            <span
                              className={`flex-shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${isAccepted
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                                }`}
                            >
                              {isAccepted ? "Accepté" : "Refusé"}
                            </span>
                          </div>

                          <p className="text-xs text-slate-400 mt-2">
                            {new Date(notif.createdAt).toLocaleString("fr-FR", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
