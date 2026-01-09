const roles = [
  {
    title: "Administrateur",
    description: "Gestion des comptes, rôles et accès globaux.",
  },
  {
    title: "Chef de projet",
    description: "Pilotage des projets, sprints et équipes.",
  },
  {
    title: "Membre d'équipe",
    description: "Mise à jour des tâches et collaboration quotidienne.",
  },
  {
    title: "Client / Stakeholder",
    description: "Consultation et validation des livrables (optionnel).",
  },
];

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <main className="mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Authentification
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">
            Accès sécurisé à la plateforme
          </h1>
          <p className="mt-4 text-slate-600">
            Connectez-vous pour accéder aux projets, tâches et sprints. L'inscription
            est réservée aux comptes autorisés par l'administrateur.
          </p>
          <form className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                placeholder="prenom.nom@cni.local"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-slate-400 focus:outline-none"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Mot de passe
              <input
                type="password"
                placeholder="••••••••"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-slate-400 focus:outline-none"
              />
            </label>
            <button
              type="button"
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Se connecter
            </button>
          </form>
          <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-800">Sécurité</p>
            <p className="mt-2">
              Authentification JWT + RBAC. Les mots de passe sont chiffrés avec BCrypt.
            </p>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Rôles disponibles</h2>
          <div className="mt-4 space-y-4">
            {roles.map((role) => (
              <div
                key={role.title}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <h3 className="text-sm font-semibold text-slate-900">{role.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{role.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
