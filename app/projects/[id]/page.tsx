const kanbanColumns = [
  {
    title: "À faire",
    tasks: [
      "Définir la structure des rôles",
      "Préparer les maquettes dashboard",
    ],
  },
  {
    title: "En cours",
    tasks: ["Implémenter l'auth JWT", "Configurer la collection projects"],
  },
  {
    title: "Terminé",
    tasks: ["Créer la base du Kanban", "Modéliser les tâches"],
  },
];

const tabs = ["Board", "Sprints", "Documents", "Rapports"];

export default function ProjectDetailsPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Projet
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                CNI-Portal · Détails
              </h1>
            </div>
            <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
              En cours
            </span>
          </div>
          <p className="mt-4 text-slate-600">
            Pilotage du portail CNI avec suivi des tâches, sprints et documentation.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:border-slate-400"
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Tableau Kanban</h2>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {kanbanColumns.map((column) => (
                <div
                  key={column.title}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <h3 className="text-sm font-semibold text-slate-900">
                    {column.title}
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    {column.tasks.map((task) => (
                      <li
                        key={task}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm"
                      >
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Sprint en cours</h2>
            <div className="mt-4 space-y-4 text-sm text-slate-600">
              <div>
                <p className="font-semibold text-slate-800">Sprint Alpha</p>
                <p className="mt-2">Objectif : livrer l'authentification et le Kanban.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-800">Dates</p>
                <p className="mt-2">08/05 - 22/05</p>
              </div>
              <div>
                <p className="font-semibold text-slate-800">Velocity</p>
                <p className="mt-2">24 points · 62% complétés</p>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">Documents</p>
              <p className="mt-2 text-sm text-slate-600">
                3 spécifications, 2 maquettes, 1 rapport de sprint.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
