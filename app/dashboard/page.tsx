const stats = [
  { label: "Projets actifs", value: "8", detail: "3 en phase de planification" },
  { label: "Tâches en retard", value: "12", detail: "Priorité haute : 4" },
  { label: "Charge équipe", value: "76%", detail: "Capacité sprint" },
  { label: "Sprints en cours", value: "2", detail: "Fin dans 5 jours" },
];

const alerts = [
  {
    title: "Sprint Alpha",
    description: "3 tâches critiques bloquées par des dépendances.",
  },
  {
    title: "Projet CNI-Portal",
    description: "Budget consommé à 68%, prévoir une revue.",
  },
  {
    title: "Incidents",
    description: "5 issues ouvertes sur le module notifications.",
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Tableau de bord
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">
            Vue synthétique des projets et tâches
          </h1>
          <p className="mt-4 text-slate-600">
            Accédez aux indicateurs clés : avancement des projets, tâches en retard,
            charge de l'équipe et suivi des sprints.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-slate-600">{stat.detail}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Projets par statut
            </h2>
            <div className="mt-6 space-y-4">
              {[
                { label: "Planifié", value: "3 projets", color: "bg-slate-200" },
                { label: "En cours", value: "4 projets", color: "bg-blue-200" },
                { label: "En pause", value: "1 projet", color: "bg-amber-200" },
                { label: "Terminé", value: "12 projets", color: "bg-emerald-200" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className={`h-3 w-3 rounded-full ${item.color}`} />
                    <span className="text-sm font-medium text-slate-700">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-sm text-slate-500">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Alertes</h2>
            <div className="mt-4 space-y-4">
              {alerts.map((alert) => (
                <div key={alert.title} className="rounded-2xl border border-slate-100 p-4">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {alert.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">{alert.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
