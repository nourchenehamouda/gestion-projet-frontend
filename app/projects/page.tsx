const projects = [
  {
    name: "CNI-Portal",
    status: "En cours",
    description: "Modernisation du portail de gestion interne.",
    tags: ["Strategic", "Web"],
  },
  {
    name: "Kanban Core",
    status: "Planifié",
    description: "Refonte du workflow de tâches et sprints.",
    tags: ["Agile", "Process"],
  },
  {
    name: "Docs Hub",
    status: "En pause",
    description: "Centralisation des documents projet et versions.",
    tags: ["Documents"],
  },
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Projets
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">
            Catalogue des projets en cours
          </h1>
          <p className="mt-4 text-slate-600">
            Gérez les projets, affectez les membres et suivez l'avancement grâce aux statuts
            et aux tags.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.name}
              className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">{project.name}</h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {project.status}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-600">{project.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-3 text-sm text-slate-500">
                <span>Chef de projet : A. Traoré</span>
                <span>•</span>
                <span>Équipe : 6 membres</span>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
