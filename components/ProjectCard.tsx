import type { Project } from "@/utils/types";
import { projectStatusLabels } from "@/utils/constants";

type ProjectCardProps = {
  project: Project;
  onEdit?: () => void;
  onDelete?: () => void;
  readOnly?: boolean;
};

export default function ProjectCard({
  project,
  onEdit,
  onDelete,
  readOnly = false,
}: ProjectCardProps) {
  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{project.name}</h3>
          <p className="mt-2 text-sm text-slate-600">{project.description}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {projectStatusLabels[project.status]}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
        <span className="rounded-full border border-slate-200 px-3 py-1">
          Début: {project.startDate}
        </span>
        {project.endDate && (
          <span className="rounded-full border border-slate-200 px-3 py-1">
            Fin: {project.endDate}
          </span>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
        {project.members.map((member) => (
          <span
            key={member.id}
            className="rounded-full border border-slate-200 px-3 py-1"
          >
            {member.name}
          </span>
        ))}
      </div>
      {!readOnly && (
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"
          >
            Modifier
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600"
          >
            Supprimer
          </button>
        </div>
      )}
    </article>
  );
}
