# RTC

Application de chat en temps réel (serveurs, channels, messages) — projet Epitech.

## Stack

| | |
|---|---|
| Monorepo | Turborepo + pnpm workspaces |
| Serveur | Node + Express 5 + TypeScript |
| Client | Next.js 16 + React 19 |
| Base | PostgreSQL 17 (Docker) + Prisma 7 |
| Auth | Better Auth |
| Lint / format | Biome |

Le serveur n'a pas d'étape de build : Node exécute les `.ts` directement (type stripping, dispo depuis Node 22.18). `tsc` ne sert qu'au `check-types`.

## Prérequis

- Node >= 22.18
- pnpm 11 (`corepack enable`)
- Docker

## Installation

```sh
pnpm install
```

Copier les fichiers d'environnement et remplir le secret :

```sh
cp .env.example .env
cp apps/server/.env.example apps/server/.env
openssl rand -base64 32   # à coller dans BETTER_AUTH_SECRET
```

Lancer Postgres et appliquer les migrations :

```sh
docker compose up -d
pnpm --filter server exec prisma migrate dev
```

> Le conteneur est exposé sur le port **5433** côté hôte (le 5432 était déjà pris par un Postgres natif sur la machine de dev).

## Développement

```sh
pnpm dev                      # tout le monorepo
pnpm dev --filter=server      # serveur seul
pnpm dev --filter=web         # client seul
```

Le client écoute sur le port **3000**, le serveur sur le **3001** (`PORT` dans `apps/server/.env`).

Autres commandes :

```sh
pnpm check-types    # tsc sur tous les packages
pnpm lint           # biome check
pnpm lint:fix       # biome check --write
```

## Structure

```
apps/
  server/           # API Express
    prisma/         # schema.prisma + migrations
    src/
      db.ts         # client Prisma (adapter pg)
      auth.ts       # config Better Auth
      index.ts      # entrée du serveur
  client/           # front Next.js (package "web")
packages/
  typescript-config/
docs/
  plan.md           # planning jusqu'à la deadline
  avancements.md    # journal de bord des séances
  db.md             # schéma de la base (source dbdiagram.io)
```

## Base de données

Le client Prisma est généré dans `apps/server/src/generated/prisma` (gitignoré) — il est régénéré automatiquement au `pnpm install` via le `postinstall`. Après toute modification de `schema.prisma` :

```sh
pnpm --filter server exec prisma migrate dev --name <nom>
```
