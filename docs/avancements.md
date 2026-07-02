# Avancements RTC

## 02/07

Lu les deux sujets (RTC + Strikes Back), fait un plan d'action avec des dates jusqu'au 24/08.

Stack choisie : Node + Express + TS côté serveur, Next.js côté client, PostgreSQL + Prisma pour la DB. Monorepo avec Turborepo + pnpm.

Pour l'auth je pars sur Better Auth. Pas Supabase cette fois, je veux gérer l'auth et le temps réel moi-même.

Fait la BDD sur dbdiagram.io. Je suis reparti de zéro par rapport à l'ancien projet (groupe), il manquait des trucs importants dedans : pas de code d'invitation, pas de owner_id sur les serveurs, rien n'empêchait un membre d'être dupliqué, le système de ban était pas clair.

Tables faites : users, servers, server_members, server_bans, channels, messages. Pas besoin de refresh_tokens, Better Auth gère ça avec sa propre table de sessions.

Un truc à pas oublier : le owner n'est pas dans server_members, donc il faudra y penser quand je ferai la route pour lister les membres d'un serveur.

Repo git initialisé, lié à GitHub. Scaffold (généré par CLI) du monorepo avec create-turbo, viré ce qui servait à rien (apps/docs, packages/ui), renommé apps/web en apps/client.
