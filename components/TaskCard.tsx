import type { Task } from "@/utils/types";

const priorityStyles: Record<Task["priority"], string> = {
  LOW: "bg-slate-100 text-slate-600",
  MEDIUM: "bg-amber-100 text-amber-700",
  HIGH: "bg-rose-100 text-rose-700",
};

type TaskCardProps = {
  task: Task;
  onEdit: () => void;
  onStatusChange?: () => void;
  canUpdateStatus?: boolean;
};

export default function TaskCard({
  task,
  onEdit,
  onStatusChange,
  canUpdateStatus = true,
}: TaskCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">{task.title}</h4>
          <p className="mt-2 text-xs text-slate-500">{task.description}</p>
        </div>
        <span
          className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
            priorityStyles[task.priority]
          }`}
        >
          {task.priority}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-500">
        {task.dueDate && (
          <span className="rounded-full border border-slate-200 px-2 py-1">
            Échéance: {task.dueDate}
          </span>
        )}
        {task.assigneeId && (
          <span className="rounded-full border border-slate-200 px-2 py-1">
            Assigné: {task.assigneeId}
          </span>
        )}
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-600"
        >
          Détails
        </button>
        {canUpdateStatus && onStatusChange && (
          <button
            type="button"
            onClick={onStatusChange}
            className="rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-600"
          >
            Changer statut
          </button>
        )}
      </div>
    </div>
  );
}
