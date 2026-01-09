import TaskCard from "@/components/TaskCard";
import type { Task, TaskStatus } from "@/utils/types";

const columns: Array<{ status: TaskStatus; label: string }> = [
  { status: "TODO", label: "To Do" },
  { status: "IN_PROGRESS", label: "In Progress" },
  { status: "DONE", label: "Done" },
];

type KanbanBoardProps = {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onMoveTask: (task: Task) => void;
  canUpdateStatus: (task: Task) => boolean;
};

export default function KanbanBoard({
  tasks,
  onEditTask,
  onMoveTask,
  canUpdateStatus,
}: KanbanBoardProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {columns.map((column) => (
        <div
          key={column.status}
          className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
        >
          <h3 className="text-sm font-semibold text-slate-900">{column.label}</h3>
          <div className="mt-4 space-y-3">
            {tasks
              .filter((task) => task.status === column.status)
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => onEditTask(task)}
                  onStatusChange={() => onMoveTask(task)}
                  canUpdateStatus={canUpdateStatus(task)}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
