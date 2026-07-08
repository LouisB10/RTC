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
