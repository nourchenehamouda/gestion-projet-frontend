const modules = [
  {
    title: "Authentification & gestion des utilisateurs",
    description:
      "Connexion/inscription (si nécessaire) avec rôles et permissions (Admin, Chef de projet, Membre d'équipe, Client optionnel).",
    bullets: [
      "Création, affectation, activation/désactivation des comptes.",
      "Gestion des droits d'accès (RBAC).",
    ],
  },
  {
    title: "Gestion des projets",
    description:
      "CRUD complet avec statut, dates, budget optionnel, tags/catégories et affectation des membres.",
    bullets: [
      "Statuts : Planifié, En cours, Terminé, En pause.",
      "Rôles par projet et affectation des membres.",
    ],
  },
  {
    title: "Gestion des tâches (Kanban)",
    description:
      "Tableau Kanban (À faire, En cours, Terminé) avec priorité, estimation, deadline et assignation.",
    bullets: [
      "Commentaires, pièces jointes et checklist de sous-tâches.",
      "Suivi du temps optionnel par tâche.",
    ],
  },
  {
    title: "Gestion des sprints (Scrum)",
    description:
      "Planification des sprints avec objectifs, backlog et dates début/fin.",
    bullets: [
      "Burndown chart et velocity optionnels.",
      "Notes de review et rétrospective (optionnel).",
    ],
  },
  {
    title: "Gestion des incidents (Issues/Bugs)",
    description:
      "Suivi des bugs et améliorations avec workflow et sévérité.",
    bullets: ["Étapes de reproduction et description détaillée."],
  },
  {
    title: "Gestion documentaire",
    description:
      "Import de documents liés aux projets (spécifications, images, etc.).",
    bullets: ["Versioning simple optionnel."],
  },
  {
    title: "Notifications",
    description:
      "Notifications internes et/ou email pour événements clés.",
    bullets: [
      "Affectation de tâches, deadlines proches, commentaires, changements de statut.",
    ],
  },
  {
    title: "Tableau de bord & rapports",
    description:
      "Dashboard pour Admin/Chef de projet avec indicateurs clés.",
    bullets: [
      "Projets par statut, tâches en retard, charge par membre, avancement sprint.",
      "Export PDF/Excel optionnel.",
    ],
  },
];

const architecture = [
  {
    title: "Front-end · Next.js",
    details: [
      "Pages : /login, /dashboard, /projects, /projects/[id] (board, sprints, documents, rapports).",
      "UI : tableaux, Kanban, formulaires, modales.",
      "Gestion du cache et des appels API : React Query ou SWR.",
      "JWT stocké dans un cookie httpOnly.",
    ],
  },
  {
    title: "Back-end · Spring Boot",
    details: [
      "Architecture en couches : Controller, Service, Repository.",
      "Sécurité : Spring Security + JWT + RBAC.",
      "Validation des données : Bean Validation.",
      "Gestion des fichiers : GridFS ou stockage local/S3.",
    ],
  },
  {
    title: "Base de données · MongoDB",
    details: [
      "Collections : users, projects, project_members, tasks, sprints, issues, comments, notifications, files.",
    ],
  },
];

const dataModels = [
  {
    title: "User",
    fields: "_id, name, email, passwordHash, role, createdAt",
  },
  {
    title: "Project",
    fields:
      "_id, name, description, status, startDate, endDate, ownerId, members[{ userId, roleInProject }]",
  },
  {
    title: "Task",
    fields:
      "_id, projectId, title, description, status, priority, assigneeId, sprintId?, dueDate, estimatePoints, labels[], attachments[], createdAt",
  },
  {
    title: "Sprint",
    fields: "_id, projectId, name, startDate, endDate, goal, taskIds[]",
  },
];

const apiEndpoints = [
  "POST /auth/login",
  "GET /users (admin)",
  "GET /projects",
  "POST /projects",
  "GET /projects/{id}",
  "POST /projects/{id}/members",
  "GET /projects/{id}/tasks",
  "POST /tasks",
  "PATCH /tasks/{id}",
  "POST /projects/{id}/sprints",
  "GET /projects/{id}/reports",
];

const workflowSteps = [
  "L'Admin crée les utilisateurs et attribue les rôles.",
  "Le Chef de projet crée un projet et affecte l'équipe.",
  "Il crée les tâches et les distribue.",
  "Lors du sprint planning, il associe les tâches au sprint.",
  "L'équipe avance via Kanban et commentaires.",
  "Le suivi se fait via le tableau de bord et les rapports.",
];

const mvpItems = [
  "Authentification JWT + rôles (Admin/PM/Member).",
  "CRUD projets + affectation des membres.",
  "CRUD tâches + statuts Kanban.",
  "Commentaires sur tâches.",
  "Dashboard simple (compteurs + tâches en retard).",
];

const bestPractices = [
  "Utiliser des DTO entre front et back pour contrôler les données exposées.",
  "Ajouter des champs de traçabilité : createdBy, updatedBy, updatedAt.",
  "Ajouter des index MongoDB : projectId, assigneeId, status, dueDate.",
  "Gestion standard des erreurs + logs (Spring Boot + middleware front).",
];

const securityItems = [
  "Mots de passe chiffrés avec BCrypt.",
  "Authentification JWT et contrôle d'accès RBAC.",
  "Validation des données avec Bean Validation.",
  "Gestion des fichiers via GridFS ou stockage externe sécurisé.",
];

const testItems = [
  "Tests des endpoints API via Postman.",
  "Tests fonctionnels de l'interface utilisateur.",
  "Vérification des principaux cas d'usage (auth, projets, tâches, sprints).",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <section className="rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            CNI · Stage de 3 semaines
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
            Plateforme de gestion de projets, tâches et sprints
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Application web centralisée pour piloter les projets, structurer le travail
            d'équipe et renforcer la collaboration grâce à une interface moderne et
            sécurisée.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              "Kanban",
              "Sprints Scrum",
              "Gestion des incidents",
              "Documents",
              "Notifications",
              "Rapports",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600"
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Accès rapide</h2>
            <p className="mt-4 text-slate-600">
              Démarrez la navigation vers les modules clés de la plateforme.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                { label: "Connexion", href: "/login" },
                { label: "Tableau de bord", href: "/dashboard" },
                { label: "Projets", href: "/projects" },
                { label: "Détails projet", href: "/projects/PRJ-001" },
                { label: "Utilisateurs", href: "/users" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300"
                >
                  {link.label}
                  <span className="text-slate-400">→</span>
                </a>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Modules couverts</h2>
            <p className="mt-4 text-slate-600">
              Auth, projets, tâches Kanban, sprints, incidents, documents, notifications
              et reporting.
            </p>
            <ul className="mt-6 list-disc space-y-2 pl-5 text-sm text-slate-600">
              <li>Gestion complète des projets et affectations.</li>
              <li>Suivi agile avec Kanban et sprints Scrum.</li>
              <li>Traçabilité via issues, documents et rapports.</li>
            </ul>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Objectifs clés</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600">
              <li>Concevoir une application web moderne et intuitive.</li>
              <li>Assurer le suivi via Kanban, sprints et rapports.</li>
              <li>Mettre en place une authentification sécurisée et des rôles.</li>
              <li>Offrir un tableau de bord clair pour l'avancement des projets.</li>
              <li>Appliquer les bonnes pratiques de développement et d'architecture.</li>
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Acteurs du système</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Administrateur",
                  description:
                    "Gère les comptes, les rôles et les autorisations d'accès.",
                },
                {
                  title: "Chef de projet",
                  description:
                    "Crée les projets, organise les sprints et suit l'avancement.",
                },
                {
                  title: "Membre d'équipe",
                  description:
                    "Met à jour les tâches, commente et suit ses responsabilités.",
                },
                {
                  title: "Client / Stakeholder",
                  description:
                    "Accès optionnel pour consultation et validation.",
                },
              ].map((actor) => (
                <div
                  key={actor.title}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-5"
                >
                  <h3 className="text-base font-semibold text-slate-900">
                    {actor.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {actor.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Fonctionnalités principales (modules)
          </h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {modules.map((module) => (
              <div
                key={module.title}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-6"
              >
                <h3 className="text-base font-semibold text-slate-900">
                  {module.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {module.description}
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
                  {module.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Architecture technique
            </h2>
            <div className="mt-4 space-y-5 text-slate-600">
              {architecture.map((item) => (
                <div key={item.title}>
                  <h3 className="text-base font-semibold text-slate-800">
                    {item.title}
                  </h3>
                  <ul className="mt-2 list-disc space-y-2 pl-5">
                    {item.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Modèle de données</h2>
            <div className="mt-4 space-y-4 text-slate-600">
              {dataModels.map((model) => (
                <div key={model.title}>
                  <h3 className="text-base font-semibold text-slate-800">
                    {model.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {model.fields}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">API REST (exemples)</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {apiEndpoints.map((endpoint) => (
              <div
                key={endpoint}
                className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600"
              >
                {endpoint}
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Sécurité &amp; validation
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600">
              {securityItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Workflow cible</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-600">
              {workflowSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">MVP (priorité)</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600">
              {mvpItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Tests &amp; qualité</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600">
              {testItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Bonnes pratiques recommandées
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600">
              {bestPractices.map((practice) => (
                <li key={practice}>{practice}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Planification</h2>
            <div className="mt-4 space-y-4 text-slate-600">
              <div>
                <h3 className="text-base font-semibold text-slate-800">Semaine 1</h3>
                <p className="mt-2 leading-7">
                  Analyse des besoins, cahier des charges, architecture, authentification et
                  gestion des utilisateurs.
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-800">Semaine 2</h3>
                <p className="mt-2 leading-7">
                  Gestion des projets, tâches, sprints et Kanban.
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-800">Semaine 3</h3>
                <p className="mt-2 leading-7">
                  Tableau de bord, rapports, tests, documentation et soutenance.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
