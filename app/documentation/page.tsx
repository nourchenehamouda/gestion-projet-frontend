"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

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

export default function DocumentationPage() {
    return (
        <div className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
            {/* Back Link */}
            <div className="max-w-6xl mx-auto mb-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Retour à l'accueil
                </Link>
            </div>

            <main className="mx-auto flex w-full max-w-6xl flex-col gap-10">
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl bg-white p-8 shadow-sm"
                >
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                        CNI · Documentation Technique
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
                                className="rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 px-4 py-2 text-sm font-medium text-indigo-600"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </motion.section>

                <section className="grid gap-6 lg:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-3xl bg-white p-8 shadow-sm"
                    >
                        <h2 className="text-xl font-semibold text-slate-900">Objectifs clés</h2>
                        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600">
                            <li>Concevoir une application web moderne et intuitive.</li>
                            <li>Assurer le suivi via Kanban, sprints et rapports.</li>
                            <li>Mettre en place une authentification sécurisée et des rôles.</li>
                            <li>Offrir un tableau de bord clair pour l'avancement des projets.</li>
                            <li>Appliquer les bonnes pratiques de développement et d'architecture.</li>
                        </ul>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-3xl bg-white p-8 shadow-sm"
                    >
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
                                    className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-5"
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
                    </motion.div>
                </section>

                <section className="rounded-3xl bg-white p-8 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-900">
                        Fonctionnalités principales (modules)
                    </h2>
                    <div className="mt-6 grid gap-6 lg:grid-cols-2">
                        {modules.map((module, index) => (
                            <motion.div
                                key={module.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                                className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-6 hover:shadow-md transition-shadow"
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
                            </motion.div>
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
                                    <p className="mt-2 text-sm leading-6 text-slate-600 font-mono bg-slate-50 p-2 rounded-lg">
                                        {model.fields}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="rounded-3xl bg-white p-8 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-900">API REST (exemples)</h2>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {apiEndpoints.map((endpoint) => (
                            <div
                                key={endpoint}
                                className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-mono text-slate-600"
                            >
                                {endpoint}
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
