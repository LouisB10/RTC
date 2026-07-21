# Avancements RTC

## 02/07

Lu les deux sujets (RTC + Strikes Back), fait un plan d'action avec des dates jusqu'au 24/08.

Stack choisie : Node + Express + TS côté serveur, Next.js côté client, PostgreSQL + Prisma pour la DB. Monorepo avec Turborepo + pnpm.

Pour l'auth je pars sur Better Auth. Pas Supabase cette fois, je veux gérer l'auth et le temps réel moi-même.

Fait la BDD sur dbdiagram.io. Je suis reparti de zéro par rapport à l'ancien projet (groupe), il manquait des trucs importants dedans : pas de code d'invitation, pas de owner_id sur les serveurs, rien n'empêchait un membre d'être dupliqué, le système de ban était pas clair.

Tables faites : users, servers, server_members, server_bans, channels, messages. Pas besoin de refresh_tokens, Better Auth gère ça avec sa propre table de sessions.

Un truc à pas oublier : le owner n'est pas dans server_members, donc il faudra y penser quand je ferai la route pour lister les membres d'un serveur.

Repo git initialisé, lié à GitHub. Scaffold (généré par CLI) du monorepo avec create-turbo, viré ce qui servait à rien (apps/docs, packages/ui), renommé apps/web en apps/client.

## 08/07

Mis à jour toute la toolchain : pnpm 9 → 11, TypeScript 5.9 → 6, plus turbo et prettier. Pour pnpm j'ai utilisé `corepack use pnpm@11.10.0` qui met à jour le champ `packageManager` et régénère le lock. TS 6 est une majeure mais rien n'a cassé.

Réglé deux warnings hérités du scaffold :

- `page.tsx` du client importait encore `@repo/ui/button` alors que j'avais viré `packages/ui` → retiré l'import et le composant Button.
- Next râlait au `dev` (« inferred workspace root ») parce que deux `package.json`/`package-lock.json` parasites traînaient dans mon home (un vieux `npm install` foireux). Supprimés, warning parti.

Créé le serveur : `apps/server` en Express 5 + TypeScript. J'ai choisi l'exécution directe du TS par Node (type stripping, dispo par défaut depuis Node 22.18) plutôt qu'un build tsc → dist. Du coup pas de nodemon ni tsx : `node --watch src/index.ts` en dev. tsconfig en `noEmit` (tsc ne sert qu'au check-types) avec `verbatimModuleSyntax` + `erasableSyntaxOnly`, et le package est en `"type": "module"`. Pour l'instant juste une route `GET /` qui renvoie « Hello World! ». `pnpm check-types` passe au vert sur tout le monorepo.

## Prochaine séance — Prisma + PostgreSQL

Objectif : brancher la base pour débloquer l'auth et les routes.

1. **Postgres via Docker** — `docker-compose.yml` à la racine (service `postgres`, user/password, volume pour persister). `docker compose up -d`. (Docker est installé.)
2. **Installer Prisma dans `apps/server`** — `prisma` en dev + `@prisma/client`, puis `prisma init` (crée `prisma/schema.prisma` et `.env` avec `DATABASE_URL`).
3. **Secrets** — vérifier que `.env` est gitignoré, créer un `.env.example` à committer, pointer `DATABASE_URL` sur le Postgres du docker-compose.
4. **Traduire le schéma dbdiagram en `schema.prisma`** — les 6 tables (`users`, `servers`, `server_members`, `server_bans`, `channels`, `messages`) + relations. Ne pas oublier : le owner n'est **pas** dans `server_members`.
5. **Migrer + tester** — `prisma migrate dev --name init`, puis une requête de test pour valider la connexion.

Décision prise : les tables d'auth de Better Auth seront maintenues **à la main dans `schema.prisma`** (pas de génération auto), pour garder un seul schéma sous contrôle.

## 15/07

Base branchée, les 5 points de la séance sont faits. Mais Prisma a sorti la v7 entre-temps et ça change deux, trois choses par rapport au plan.

Gros changement : **Prisma 7.8, le moteur Rust a disparu**. L'ancien générateur `prisma-client-js` est en voie de dépréciation. Je suis reparti sur le nouveau générateur `prisma-client` (ESM-first, sans moteur), qui colle bien mieux à notre setup (ESM natif + type-stripping, pas de build). Concrètement :

- Le client est généré dans `src/generated/prisma` (gitignoré), en `.ts` avec imports à extension explicite (`./enums.ts`) et enums en `const` + union de types — donc zéro souci avec `erasableSyntaxOnly` ni avec l'exécution directe des `.ts`. `check-types` passe.
- Comme le moteur ne bundle plus les drivers, il faut un **driver adapter** : installé `pg` + `@prisma/adapter-pg`. Le `PrismaClient` s'instancie avec l'adapter (`new PrismaClient({ adapter: new PrismaPg({ connectionString }) })`), fait dans `src/db.ts`.
- Prisma 7 génère un `prisma.config.ts` : l'URL de la base n'est plus dans `schema.prisma` mais dans ce fichier (`datasource.url` ← `process.env.DATABASE_URL`), chargé via `import "dotenv/config"`. Du coup `dotenv` en devDep.
- Ajouté `postinstall: prisma generate` (le client généré est gitignoré, faut le régénérer sur un clone frais). Runtime : `node --env-file-if-exists=.env` pour charger le `.env`.

Docker : le port **5432 était déjà pris** par un Postgres natif sur ma machine, j'ai mappé le conteneur sur **5433** côté hôte (`docker-compose.yml`, image `postgres:17-alpine`, volume pour persister). `DATABASE_URL` pointe sur `localhost:5433`.

Secrets ok : `.env` (racine + `apps/server`) gitignorés, `.env.example` committés, client généré ignoré.

Schéma traduit depuis `docs/db.md` : les 6 tables + les 2 enums (`user_status`, `member_role`). Noms Prisma idiomatiques avec `@map`/`@@map` pour garder les noms SQL. Le owner reste bien hors de `server_members` (relation `Server.owner`). `db.md` ne précisait aucun `ON DELETE`, j'en ai ajouté : cascade depuis un serveur (channels/members/bans/messages), et `SetNull` sur `messages.author_id` (déjà nullable → on garde le message si l'auteur part). Migration `init` appliquée, round-trip create/read/delete testé en vrai contre la base : OK.

À noter : `db.md` **ne contient pas** les tables Better Auth (session/account/verification). Je les ajouterai à la main quand j'attaquerai l'auth (étape 5 du plan), pas maintenant. Petit point à trancher à ce moment-là : `users.password_hash` est dans le schéma actuel alors que Better Auth stocke plutôt le mot de passe dans sa table `account` — faudra décider si on garde `password_hash` ou si on s'aligne sur Better Auth.

## Prochaine séance — Authentification (Better Auth)

1. Ajouter les tables Better Auth à la main dans `schema.prisma` (session, account, verification) + migration.
2. Brancher Better Auth sur Prisma, trancher la question `password_hash` vs table `account`.
3. Routes d'inscription / connexion / session.

## 21/07

Remise au propre : rien de la séance du 15/07 n'était commité.

`apps/server/package.json` avait **perdu ses dépendances** (`@prisma/client`, `@prisma/adapter-pg`, `pg`, + `prisma`, `dotenv`, `@types/pg` en dev) et le script `postinstall: prisma generate`. Les paquets étaient dans `node_modules` mais plus déclarés : ça marchait chez moi, un clone frais était cassé. Restauré, et `dev`/`start` passés en `node --env-file-if-exists=.env`. Le `pnpm-lock.yaml` s'était aussi réaligné sur le HEAD, `pnpm install` l'a régénéré.

Lint : le commit Biome (`8d22407`) n'avait jamais reformaté l'existant, `biome check .` est rouge partout. Nettoyé **`apps/server` uniquement** (quotes doubles, `_req` dans `index.ts`, `process.env.DATABASE_URL` dans `prisma.config.ts`) ; le client et le `biome.json` déprécié attendront une séance dédiée.

Vérifs avant commit : `rtc-postgres` healthy sur 5433, `check-types` vert, `biome check apps/server` vert, `migrate status` → up to date, requête réelle contre la base OK. Poussé en 3 commits.

**Prisma 7.9.0 est sorti** — mise à jour repoussée pour ne pas la mélanger avec l'auth.

Replanifié `plan.md` : ~10 jours de retard. Je garde les 26 étapes mais je réordonne **par couche** — backend en continu jusqu'au 08/08, client Next.js d'un bloc ensuite. Ça mange la marge du 17-21/08 : point de bascule au 15/08, si le client n'est pas debout je coupe dans les bonus.

## Prochaine séance — Authentification, pour de vrai

1. **`apps/server/src/auth.ts`** : `betterAuth({ database: prismaAdapter(prisma, { provider: "postgresql" }) })`, le client Prisma venant de `src/db.ts` (pas de `@prisma/client`, notre output est custom). Email/password seulement, pas d'OAuth vu le retard. Importer depuis `better-auth/minimal` et activer `experimental: { joins: true }` (2-3× sur `/get-session`).
2. **Schéma** : `@better-auth/cli generate` pour les models `session` / `account` / `verification`, puis relecture à la main aux conventions du projet (`@map`/`@@map` snake_case, `@db.Uuid`). Le CLI ne migre pas → `prisma migrate dev --name auth`.
3. **Trancher `password_hash`** : je penche pour le supprimer et laisser `account` porter le credential (sinon deux sources de vérité ; la table `users` est vide, migration indolore). `User` doit alors gagner `emailVerified`, `updatedAt` et un `name` — reste à décider : `name` mappé sur l'`username` existant, ou colonne distincte avec `username` en handle unique façon Discord.
4. **Handler Express 5** : `app.all("/api/auth/*splat", toNodeHandler(auth))` — le `*` seul ne marche plus en Express 5. Ajouter `BETTER_AUTH_SECRET` et `BETTER_AUTH_URL` dans `.env` et `.env.example`.
5. **Tester** signup / signin / get-session au curl, puis écrire le middleware `requireAuth` qui débloque les routes des étapes 6 à 9.
