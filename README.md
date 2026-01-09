# Gestion Projet Frontend

Frontend Next.js pour la gestion de projets et tâches (Kanban) avec authentification JWT via API Spring Boot.

## Prérequis
- Node.js 18+
- API Spring Boot disponible

## Installation
```bash
npm install
```

## Configuration
Créer un fichier `.env.local` :
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

## Développement
```bash
npm run dev
```

L'application est disponible sur [http://localhost:3000](http://localhost:3000).

## Pages principales
- `/login`
- `/dashboard`
- `/projects`
- `/projects/[id]`
- `/users`
