# Plan d'action RTC — deadline 24/08

| # | Étape | Dates |
|---|---|---|
| 1 | Réaliser la BDD | 02-03/07 |
| 2 | Définir l'architecture du projet | 02-03/07 |
| 3 | Définir la stack du projet | 02-03/07 |
| 4 | Initialiser le projet (serveur + client) | 06-15/07 |
| 5 | Faire l'authentification | 21-25/07 |
| 6 | Faire la gestion des serveurs et des rôles | 21-25/07 |
| 7 | Faire la gestion des channels | 28/07-01/08 |
| 8 | Faire les messages en REST | 28/07-01/08 |
| 9 | Ajouter le temps réel avec Socket.IO | 28/07-01/08 |
| 10 | Construire le client Next.js | 11-15/08 |
| 11 | Écrire les tests | 18-22/08 |
| 12 | Documenter les sockets | 28/07-01/08 |
| 13 | Faire les bonus | 18-22/08 |

## RTC Strikes Back

| # | Étape | Dates |
|---|---|---|
| 14 | Faire le kick d'un membre | 04-08/08 |
| 15 | Faire le ban temporaire d'un membre | 04-08/08 |
| 16 | Faire le ban permanent d'un membre | 04-08/08 |
| 17 | Faire l'édition des messages | 04-08/08 |
| 18 | Ajouter l'internationalisation FR/EN | 11-15/08 |
| 19 | Mettre en place la CI/CD sur GitHub | 18-22/08 |
| 20 | Intégrer une API de GIF | 18-22/08 |
| 21 | Faire les messages privés | 04-08/08 |
| 22 | Ajouter les réactions aux messages | 04-08/08 |
| 23 | Faire l'application desktop (Tauri ou Electron) | 18-22/08 |
| 24 | Ajouter les notifications système | 18-22/08 |

## Marge de sécurité

| # | Étape | Dates |
|---|---|---|
| 25 | Corrections, tests globaux, relecture | 23-24/08 |
| 26 | Marge finale avant deadline | 24/08 — DEADLINE |

Replanifié le 21/07 : l'auth démarrait avec ~10 jours de retard. Les 26 étapes
sont conservées, le calendrier est compressé et réordonné **par couche** (tout le
backend d'abord, le client Next.js d'un seul bloc) au lieu de suivre l'ordre du
sujet, pour éviter les allers-retours serveur/client.

⚠️ La marge de sécurité du 17-21/08 est consommée : il ne reste que le week-end
du 22-23/08. Point de bascule au **15/08** — si le client Next.js n'est pas
debout à cette date, couper dans les bonus (20 GIF, 22 réactions, 23 desktop,
24 notifications) pour protéger les étapes 11 (tests) et 25 (relecture).
